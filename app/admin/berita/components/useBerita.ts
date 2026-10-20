"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Berita, BeritaInput } from "./types";
import {
  BUCKET,
  COLS,
  MAX_COVER,
  PAGE,
  TABLE,
  errMsg,
  makeSlug,
  prepareCover,
} from "./utils";

export default function useBerita() {
  const supabase = useMemo(() => createClient(), []);

  const [items, setItems] = useState<Berita[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  // "baru" = form tambah, Berita = form ubah, null = tertutup
  const [editing, setEditing] = useState<Berita | "baru" | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Berita | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ----- data ----- */

  const load = useCallback(async () => {
    const all: Berita[] = [];
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
      all.push(...((data ?? []) as Berita[]));
      if (!data || data.length < PAGE) break;
    }
    if (!failed) setItems(all);
    setLoaded(true);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const urlOf = useCallback(
    (path: string) =>
      supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
    [supabase]
  );

  const categories = useMemo(() => {
    const set = new Set(items.map((b) => b.category).filter(Boolean));
    return ["Semua", ...Array.from(set).sort()];
  }, [items]);

  const listed = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((b) => {
      if (category !== "Semua" && b.category !== category) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q)
      );
    });
  }, [items, query, category]);

  /* ----- simpan (tambah / ubah) ----- */

  async function save(
    existing: Berita | null,
    v: BeritaInput,
    cover: File | null,
    removeCover: boolean
  ): Promise<boolean> {
    if (saving) return false;
    setSaving(true);
    setError(null);

    let newPath: string | null = null;
    try {
      const id = existing?.id ?? crypto.randomUUID();

      if (cover) {
        if (cover.size > MAX_COVER) {
          throw new Error("Gambar lebih dari 10 MB.");
        }
        const p = await prepareCover(cover);
        newPath = `${id}-${Date.now()}.${p.ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(newPath, p.blob, {
            contentType: p.type,
            cacheControl: "31536000",
          });
        if (upErr) {
          newPath = null;
          throw upErr;
        }
      }

      let cover_path = existing?.cover_path ?? null;
      if (newPath) cover_path = newPath;
      else if (removeCover) cover_path = null;

      const title = v.title.trim().slice(0, 150);
      const fields = {
        title,
        summary: v.summary.trim().slice(0, 300),
        category: v.category,
        content: v.content.trim(),
        published: v.published,
        cover_path,
      };

      if (existing) {
        // slug sengaja tidak diubah agar alamat publik tetap sama
        const { data, error } = await supabase
          .from(TABLE)
          .update({ ...fields, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select(COLS);
        if (error) throw error;
        if (!data?.length) {
          throw new Error(
            "Perubahan ditolak. Pastikan akun ini berstatus admin."
          );
        }
        const row = data[0] as Berita;
        setItems((prev) => prev.map((x) => (x.id === id ? row : x)));
      } else {
        const { data, error } = await supabase
          .from(TABLE)
          .insert({ id, slug: makeSlug(title, id), ...fields })
          .select(COLS)
          .single();
        if (error) throw error;
        setItems((prev) => [data as Berita, ...prev]);
      }

      // gambar lama dibuang setelah data tersimpan
      if (existing?.cover_path && existing.cover_path !== cover_path) {
        await supabase.storage.from(BUCKET).remove([existing.cover_path]);
      }

      setEditing(null);
      return true;
    } catch (err) {
      if (newPath) await supabase.storage.from(BUCKET).remove([newPath]);
      setError(errMsg(err));
      return false;
    } finally {
      setSaving(false);
    }
  }

  /* ----- terbit / sembunyikan ----- */

  async function togglePublished(b: Berita) {
    setError(null);
    const next = !b.published;
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from(TABLE)
      .update({ published: next, updated_at: now })
      .eq("id", b.id)
      .select("id");
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
        x.id === b.id ? { ...x, published: next, updated_at: now } : x
      )
    );
  }

  /* ----- hapus ----- */

  function askDelete(b: Berita) {
    setToDelete(b);
  }

  function cancelDelete() {
    if (!deleting) setToDelete(null);
  }

  async function doDelete() {
    if (!toDelete || deleting) return;
    setDeleting(true);
    setError(null);
    try {
      const b = toDelete;
      const { data, error } = await supabase
        .from(TABLE)
        .delete()
        .eq("id", b.id)
        .select("id");
      if (error) throw error;
      if (!data?.length) {
        throw new Error(
          "Penghapusan ditolak. Pastikan akun ini berstatus admin."
        );
      }

      if (b.cover_path) {
        const { error: rmErr } = await supabase.storage
          .from(BUCKET)
          .remove([b.cover_path]);
        if (rmErr) {
          setError(
            "Data terhapus, tetapi gambar gagal dihapus dari storage: " +
              rmErr.message
          );
        }
      }
      setItems((prev) => prev.filter((x) => x.id !== b.id));
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  return {
    // state
    loaded,
    error,
    setError,
    query,
    setQuery,
    category,
    setCategory,
    editing,
    setEditing,
    saving,
    toDelete,
    deleting,
    // turunan
    items,
    listed,
    categories,
    urlOf,
    // aksi
    load,
    save,
    togglePublished,
    askDelete,
    cancelDelete,
    doDelete,
  };
}

export type BeritaState = ReturnType<typeof useBerita>;