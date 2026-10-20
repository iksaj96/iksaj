"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Photo } from "./types";
import type { Galeri } from "./useGaleri";

function EditForm({ d, photo }: { d: Galeri; photo: Photo }) {
  const [title, setTitle] = useState(photo.title);
  const [caption, setCaption] = useState(photo.caption ?? "");

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !d.saving) d.setEditing(null);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [d]);

  function submit(e: FormEvent) {
    e.preventDefault();
    d.saveEdit(photo, title, caption);
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-[#FBF6E6]/20 bg-[#FBF6E6]/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-[#FBF6E6]/30 focus:border-[#FFD21F]";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto px-5 py-8">
      <button
        type="button"
        aria-label="Tutup"
        onClick={() => !d.saving && d.setEditing(null)}
        className="fixed inset-0 bg-black/70"
      />
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-foto-judul"
        className="relative w-full max-w-md rounded-3xl border-2 border-[#FFD21F] bg-[#14110a] p-6 shadow-[6px_6px_0_0_#FFD21F]"
      >
        <h2
          id="edit-foto-judul"
          className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight"
        >
          Ubah detail foto
        </h2>

        <div className="mt-4 overflow-hidden rounded-2xl bg-[#FBF6E6]/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={d.urlOf(photo)}
            alt={photo.title}
            className="mx-auto max-h-48 w-full object-contain"
          />
        </div>

        <label className="mt-4 block text-sm font-semibold">
          Judul
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
            autoFocus
            className={field}
          />
        </label>

        <label className="mt-4 block text-sm font-semibold">
          Keterangan
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Tulis keterangan singkat (opsional)"
            className={`${field} resize-none`}
          />
          <span className="mt-1 block text-right text-[11px] font-normal text-[#FBF6E6]/40">
            {caption.length}/500
          </span>
        </label>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => d.setEditing(null)}
            disabled={d.saving}
            className="rounded-full border border-[#FBF6E6]/30 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F] disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={d.saving}
            className="rounded-full bg-[#FFD21F] px-5 py-2.5 text-sm font-bold text-[#14110a] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
          >
            {d.saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditDialog({ d }: { d: Galeri }) {
  if (!d.editing) return null;
  return <EditForm key={d.editing.id} d={d} photo={d.editing} />;
}