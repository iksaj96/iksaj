"use client";

import useBerita from "./components/useBerita";
import BeritaForm from "./components/BeritaForm";
import DeleteDialog from "./components/DeleteDialog";
import { Ico } from "./components/icons";
import { excerpt, formatDate } from "./components/utils";

export default function BeritaPage() {
  const d = useBerita();

  const iconBtn =
    "grid h-9 w-9 place-items-center rounded-lg border border-[#FBF6E6]/25 bg-[#14110a]/85 text-[#FBF6E6] transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]";

  const terbit = d.items.filter((b) => b.published).length;
  const filtered = !!d.query || d.category !== "Semua";

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] lg:min-h-dvh">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Berita
        </h1>
        <p className="mt-3 max-w-xl text-[#FBF6E6]/70">
          Tulis dan atur berita kegiatan IKSAJ. Berita yang disembunyikan
          tidak tampil di halaman publik.
        </p>

        <p className="mt-6 text-sm">
          <span className="font-semibold">{d.items.length} berita</span>
          <span className="text-[#FBF6E6]/60">
            {" "}
            · {terbit} terbit · {d.items.length - terbit} disembunyikan
          </span>
        </p>

        {/* bilah perintah */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => d.setEditing("baru")}
            className="inline-flex items-center gap-2 rounded-full bg-[#FFD21F] px-5 py-2.5 text-sm font-bold text-[#14110a] transition-transform hover:-translate-y-0.5"
          >
            <Ico name="plus" />
            Tambah berita
          </button>

          <select
            value={d.category}
            onChange={(e) => d.setCategory(e.target.value)}
            aria-label="Filter kategori"
            className="rounded-full border border-[#FBF6E6]/25 bg-[#14110a] px-4 py-2.5 text-sm font-semibold outline-none transition-colors focus:border-[#FFD21F]"
          >
            {d.categories.map((c) => (
              <option key={c} value={c}>
                {c === "Semua" ? "Semua kategori" : c}
              </option>
            ))}
          </select>

          <div className="ml-auto flex w-full items-center gap-2 rounded-full border border-[#FBF6E6]/15 bg-[#14110a]/60 px-3.5 transition-colors focus-within:border-[#FFD21F] sm:w-64">
            <Ico name="search" className="h-4 w-4 text-[#FBF6E6]/50" />
            <input
              type="search"
              value={d.query}
              onChange={(e) => d.setQuery(e.target.value)}
              placeholder="Cari judul, ringkasan, atau isi"
              aria-label="Cari berita"
              className="w-full min-w-0 bg-transparent py-2.5 text-sm outline-none placeholder:text-[#FBF6E6]/30"
            />
          </div>
        </div>

        {/* pesan (form yang terbuka menampilkan galatnya sendiri) */}
        {d.error && !d.editing && (
          <div
            role="alert"
            className="mt-4 flex items-start justify-between gap-3 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-2.5 text-sm text-red-300"
          >
            <span className="min-w-0 break-words">{d.error}</span>
            <button
              type="button"
              aria-label="Tutup pesan"
              onClick={() => d.setError(null)}
              className="shrink-0 text-red-300/70 hover:text-red-200"
            >
              <Ico name="close" className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* isi */}
        <div className="mt-6">
          {!d.loaded ? (
            <p className="py-20 text-center text-sm text-[#FBF6E6]/50">
              Memuat...
            </p>
          ) : d.listed.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-[#FFD21F]/30 bg-[#14110a]/50 px-4 py-20 text-center">
              <div className="flex justify-center text-[#FFD21F]">
                <Ico name="news" className="h-12 w-12" />
              </div>
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-extrabold">
                {filtered ? "Tidak ada berita yang cocok" : "Belum ada berita"}
              </p>
              <p className="mt-1 text-sm text-[#FBF6E6]/50">
                {filtered
                  ? "Coba kata kunci atau kategori lain."
                  : "Klik Tambah berita untuk menulis yang pertama."}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {d.listed.map((b) => (
                <li
                  key={b.id}
                  className="flex gap-4 rounded-2xl border-2 border-[#FBF6E6]/10 bg-[#14110a]/70 p-3 transition-colors hover:border-[#FFD21F]/60 sm:p-4"
                >
                  <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#FBF6E6]/5 text-[#FBF6E6]/30 sm:h-24 sm:w-36">
                    {b.cover_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.urlOf(b.cover_path)}
                        alt={b.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Ico name="news" className="h-7 w-7" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#FFD21F]/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#FFD21F]">
                        {b.category}
                      </span>
                      {!b.published && (
                        <span className="rounded-full border border-[#FBF6E6]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[#FBF6E6]/60">
                          Disembunyikan
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1.5 truncate font-[family-name:var(--font-display)] text-lg font-extrabold">
                      {b.title}
                    </h2>
                    <p className="text-xs text-[#FBF6E6]/50">
                      {formatDate(b.created_at)}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-sm text-[#FBF6E6]/70">
                      {b.summary || excerpt(b.content)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row sm:items-start">
                    <button
                      type="button"
                      title={b.published ? "Sembunyikan" : "Terbitkan"}
                      aria-label={
                        b.published
                          ? `Sembunyikan ${b.title}`
                          : `Terbitkan ${b.title}`
                      }
                      onClick={() => d.togglePublished(b)}
                      className={iconBtn}
                    >
                      <Ico
                        name={b.published ? "eye" : "eyeOff"}
                        className="h-4 w-4"
                      />
                    </button>
                    <button
                      type="button"
                      title="Ubah"
                      aria-label={`Ubah ${b.title}`}
                      onClick={() => d.setEditing(b)}
                      className={iconBtn}
                    >
                      <Ico name="pen" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Hapus"
                      aria-label={`Hapus ${b.title}`}
                      onClick={() => d.askDelete(b)}
                      className={`${iconBtn} hover:!border-red-300 hover:!text-red-300`}
                    >
                      <Ico name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <BeritaForm d={d} />
      <DeleteDialog d={d} />
    </div>
  );
}