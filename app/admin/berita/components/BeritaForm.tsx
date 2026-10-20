"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Berita } from "./types";
import type { BeritaState } from "./useBerita";
import { CATEGORIES, MAX_COVER } from "./utils";
import { Ico } from "./icons";

function Form({ d, berita }: { d: BeritaState; berita: Berita | null }) {
  const [title, setTitle] = useState(berita?.title ?? "");
  const [summary, setSummary] = useState(berita?.summary ?? "");
  const [category, setCategory] = useState(berita?.category ?? CATEGORIES[0]);
  const [content, setContent] = useState(berita?.content ?? "");
  const [published, setPublished] = useState(berita?.published ?? true);

  const [cover, setCover] = useState<File | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [localErr, setLocalErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // pratinjau gambar yang baru dipilih
  useEffect(() => {
    if (!cover) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(cover);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [cover]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !d.saving) d.setEditing(null);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [d]);

  const existingUrl =
    berita?.cover_path && !removeCover ? d.urlOf(berita.cover_path) : null;
  const shownCover = preview ?? existingUrl;

  function pickCover(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setLocalErr("Berkas harus berupa gambar.");
      return;
    }
    if (f.size > MAX_COVER) {
      setLocalErr("Gambar lebih dari 10 MB.");
      return;
    }
    setLocalErr(null);
    setCover(f);
    setRemoveCover(false);
  }

  function clearCover() {
    setCover(null);
    setRemoveCover(true);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    await d.save(
      berita,
      { title, summary, category, content, published },
      cover,
      removeCover
    );
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
        aria-labelledby="berita-form-judul"
        className="relative w-full max-w-2xl rounded-3xl border-2 border-[#FFD21F] bg-[#14110a] p-6 shadow-[6px_6px_0_0_#FFD21F]"
      >
        <h2
          id="berita-form-judul"
          className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight"
        >
          {berita ? "Ubah berita" : "Tambah berita"}
        </h2>

        <label className="mt-5 block text-sm font-semibold">
          Judul
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
            autoFocus
            className={field}
          />
        </label>

        <label className="mt-4 block text-sm font-semibold">
          Kategori
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={field}
          >
            {/* kategori lama yang tidak ada di daftar tetap bisa dipilih */}
            {!CATEGORIES.includes(category) && (
              <option value={category} className="bg-[#14110a]">
                {category}
              </option>
            )}
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#14110a]">
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-sm font-semibold">
          Ringkasan
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Satu-dua kalimat untuk daftar berita (opsional)"
            className={`${field} resize-none`}
          />
          <span className="mt-1 block text-right text-[11px] font-normal text-[#FBF6E6]/40">
            {summary.length}/300
          </span>
        </label>

        <label className="mt-4 block text-sm font-semibold">
          Isi berita
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
            placeholder="Tulis isi berita di sini"
            className={`${field} resize-y leading-relaxed`}
          />
          <span className="mt-1 block text-right text-[11px] font-normal text-[#FBF6E6]/40">
            {content.length} karakter
          </span>
        </label>

        <div className="mt-4">
          <p className="text-sm font-semibold">Gambar utama (opsional)</p>
          <div className="mt-1.5 flex items-center gap-4">
            <div className="grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#FBF6E6]/20 bg-[#FBF6E6]/5 text-[#FBF6E6]/30">
              {shownCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shownCover}
                  alt="Gambar utama"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Ico name="image" className="h-8 w-8" />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-full border border-[#FBF6E6]/30 px-4 py-2 text-sm font-semibold transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]"
              >
                {shownCover ? "Ganti gambar" : "Pilih gambar"}
              </button>
              {shownCover && (
                <button
                  type="button"
                  onClick={clearCover}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-400/10"
                >
                  Hapus gambar
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => pickCover(e.target.files?.[0])}
            />
          </div>
          {localErr && <p className="mt-2 text-xs text-red-300">{localErr}</p>}
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 accent-[#FFD21F]"
          />
          Terbitkan di halaman publik
        </label>

        {d.error && (
          <p
            role="alert"
            className="mt-4 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-2.5 text-sm text-red-300"
          >
            {d.error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
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

export default function BeritaForm({ d }: { d: BeritaState }) {
  if (!d.editing) return null;
  const berita = d.editing === "baru" ? null : d.editing;
  return <Form key={berita?.id ?? "baru"} d={d} berita={berita} />;
}