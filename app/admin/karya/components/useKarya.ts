"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Karya, KaryaInput } from "./types";
import {
  BUCKET,
  COLS,
  MAX_COVER,
  PAGE,
  TABLE,
  errMsg,
  prepareCover,
} from "./utils";

export default function useKarya() {
  const supabase = useMemo(() => createClient(), []);

  const [items, setItems] = useState<Karya[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  // "baru" = form tambah, Karya = form ubah, null = tertutup
  const [editing, setEditing] = useState<Karya | "baru" | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Karya | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ----- data ----- */

  const load = useCallback(async () => {
    const all: Karya[] = [];
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
      all.push(...((data ?? []) as Karya[]));
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
    const set = new Set(items.map((k) => k.category).filter(Boolean));
    return ["Semua", ...Array.from(set).sort()];
  }, [items]);

  const listed = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((k) => {
      if (category !== "Semua" && k.category !== category) return false;
      if (!q) return true;
      return (
        k.title.toLowerCase().includes(q) ||
        k.author.toLowerCase().includes(q) ||
        k.content.toLowerCase().includes(q)
      );
    });
  }, [items, query, category]);

  /* ----- simpan (tambah / ubah) ----- */

  async function save(
    existing: Karya | null,
    v: KaryaInput,
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
          throw new Error("Sampul lebih dari 10 MB.");
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

      const fields = {
        title: v.title.trim().slice(0, 150),
        author: v.author.trim().slice(0, 100),
        category: v.category,
        content: v.content.trim(),
        published: v.published,
        cover_path,
      };

      if (existing) {
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
        const row = data[0] as Karya;
        setItems((prev) => prev.map((x) => (x.id === id ? row : x)));
      } else {
        const { data, error } = await supabase
          .from(TABLE)
          .insert({ id, ...fields })
          .select(COLS)
          .single();
        if (error) throw error;
        setItems((prev) => [data as Karya, ...prev]);
      }

      // sampul lama dibuang setelah data tersimpan
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

  async function togglePublished(k: Karya) {
    setError(null);
    const next = !k.published;
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from(TABLE)
      .update({ published: next, updated_at: now })
      .eq("id", k.id)
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
        x.id === k.id ? { ...x, published: next, updated_at: now } : x
      )
    );
  }

  /* ----- hapus ----- */

  function askDelete(k: Karya) {
    setToDelete(k);
  }

  function cancelDelete() {
    if (!deleting) setToDelete(null);
  }

  async function doDelete() {
    if (!toDelete || deleting) return;
    setDeleting(true);
    setError(null);
    try {
      const k = toDelete;
      const { data, error } = await supabase
        .from(TABLE)
        .delete()
        .eq("id", k.id)
        .select("id");
      if (error) throw error;
      if (!data?.length) {
        throw new Error(
          "Penghapusan ditolak. Pastikan akun ini berstatus admin."
        );
      }

      if (k.cover_path) {
        const { error: rmErr } = await supabase.storage
          .from(BUCKET)
          .remove([k.cover_path]);
        if (rmErr) {
          setError(
            "Data terhapus, tetapi sampul gagal dihapus dari storage: " +
              rmErr.message
          );
        }
      }
      setItems((prev) => prev.filter((x) => x.id !== k.id));
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

export type KaryaState = ReturnType<typeof useKarya>;