"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Photo } from "./types";
import {
  BUCKET,
  COLS,
  GALERI_QUOTA,
  MAX_INPUT,
  PAGE,
  TABLE,
  baseName,
  errMsg,
  formatSize,
  prepareImage,
} from "./utils";

export default function useGaleri() {
  const supabase = useMemo(() => createClient(), []);

  const [items, setItems] = useState<Photo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Photo[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  /* ----- data ----- */

  const load = useCallback(async () => {
    const all: Photo[] = [];
    let failed = false;
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from(TABLE)
        .select(COLS)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(from, from + PAGE - 1);
      if (error) {
        setError(errMsg(error));
        failed = true;
        break;
      }
      all.push(...((data ?? []) as Photo[]));
      if (!data || data.length < PAGE) break;
    }
    if (!failed) setItems(all);
    setLoaded(true);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const urlOf = useCallback(
    (p: Photo) =>
      supabase.storage.from(BUCKET).getPublicUrl(p.storage_path).data
        .publicUrl,
    [supabase]
  );

  const listed = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.caption ?? "").toLowerCase().includes(q)
    );
  }, [items, query]);

  const used = useMemo(
    () => items.reduce((s, p) => s + (Number(p.size) || 0), 0),
    [items]
  );

  /* ----- pilihan ----- */

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function selectAll() {
    setSelected(new Set(listed.map((p) => p.id)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  const selectedItems = useMemo(
    () => items.filter((p) => selected.has(p.id)),
    [items, selected]
  );

  /* ----- unggah ----- */

  async function uploadFiles(files: File[]) {
    if (!files.length || busy) return;
    setError(null);

    const images = files.filter((f) => f.type.startsWith("image/"));
    const failed: string[] = [];
    if (images.length < files.length) {
      failed.push(`${files.length - images.length} berkas bukan gambar`);
    }

    let running = used;

    for (let i = 0; i < images.length; i++) {
      const f = images[i];
      setBusy(`Mengunggah ${i + 1}/${images.length}: ${f.name}`);

      if (f.size > MAX_INPUT) {
        failed.push(`${f.name} (lebih dari 50 MB)`);
        continue;
      }

      const p = await prepareImage(f);

      if (running + p.blob.size > GALERI_QUOTA) {
        failed.push(
          `${f.name} (melebihi jatah Galeri ${formatSize(GALERI_QUOTA)})`
        );
        continue;
      }

      const id = crypto.randomUUID();
      const path = `${id}.${p.ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, p.blob, {
          contentType: p.type,
          cacheControl: "31536000",
        });
      if (upErr) {
        failed.push(`${f.name} (${upErr.message})`);
        continue;
      }

      const { data, error: dbErr } = await supabase
        .from(TABLE)
        .insert({
          id,
          title: baseName(f.name).slice(0, 120),
          storage_path: path,
          mime_type: p.type,
          size: p.blob.size,
          width: p.width,
          height: p.height,
        })
        .select(COLS)
        .single();

      if (dbErr) {
        await supabase.storage.from(BUCKET).remove([path]);
        failed.push(`${f.name} (${dbErr.message})`);
      } else {
        running += p.blob.size;
        setItems((prev) => [data as Photo, ...prev]);
      }
    }

    setBusy(null);
    if (failed.length) setError("Gagal mengunggah: " + failed.join("; "));
  }

  function openUploadDialog() {
    fileRef.current?.click();
  }

  /* ----- ubah judul / keterangan ----- */

  async function saveEdit(p: Photo, title: string, caption: string) {
    if (saving) return;
    setSaving(true);
    setError(null);
    const t = title.trim().slice(0, 120) || p.title;
    const c = caption.trim().slice(0, 500) || null;
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from(TABLE)
      .update({ title: t, caption: c, updated_at: now })
      .eq("id", p.id)
      .select("id");

    setSaving(false);
    if (error) {
      setError(errMsg(error));
      return;
    }
    if (!data?.length) {
      setError("Perubahan ditolak. Pastikan akun ini berstatus admin.");
      return;
    }
    setItems((prev) =>
      prev.map((x) =>
        x.id === p.id ? { ...x, title: t, caption: c, updated_at: now } : x
      )
    );
    setEditing(null);
  }

  /* ----- hapus ----- */

  function askDelete(list: Photo[]) {
    if (list.length) setToDelete(list);
  }

  function cancelDelete() {
    if (!deleting) setToDelete(null);
  }

  async function doDelete() {
    if (!toDelete || deleting) return;
    setDeleting(true);
    setError(null);
    try {
      const list = toDelete;
      const ids = list.map((p) => p.id);

      const { data, error } = await supabase
        .from(TABLE)
        .delete()
        .in("id", ids)
        .select("id");
      if (error) throw error;

      const gone = new Set((data ?? []).map((r: { id: string }) => r.id));
      if (gone.size === 0) {
        throw new Error("Penghapusan ditolak. Pastikan akun ini berstatus admin.");
      }

      const paths = list
        .filter((p) => gone.has(p.id))
        .map((p) => p.storage_path);
      for (let i = 0; i < paths.length; i += 100) {
        const { error: rmErr } = await supabase.storage
          .from(BUCKET)
          .remove(paths.slice(i, i + 100));
        if (rmErr) {
          setError(
            "Data terhapus, tetapi sebagian berkas gagal dihapus dari storage: " +
              rmErr.message
          );
          break;
        }
      }

      setItems((prev) => prev.filter((p) => !gone.has(p.id)));
      setSelected((prev) => {
        const n = new Set(prev);
        gone.forEach((id) => n.delete(id));
        return n;
      });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  return {
    // ref
    fileRef,
    // state
    loaded,
    error,
    setError,
    busy,
    query,
    setQuery,
    selected,
    lightbox,
    setLightbox,
    editing,
    setEditing,
    saving,
    toDelete,
    deleting,
    dragging,
    setDragging,
    // turunan
    items,
    listed,
    used,
    selectedItems,
    urlOf,
    // aksi
    load,
    toggleSelect,
    selectAll,
    clearSelection,
    uploadFiles,
    openUploadDialog,
    saveEdit,
    askDelete,
    cancelDelete,
    doDelete,
  };
}

export type Galeri = ReturnType<typeof useGaleri>;