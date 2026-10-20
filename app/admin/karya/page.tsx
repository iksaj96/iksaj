"use client";

import useKarya from "./components/useKarya";
import KaryaForm from "./components/KaryaForm";
import DeleteDialog from "./components/DeleteDialog";
import { Ico } from "./components/icons";
import { excerpt, formatDate } from "./components/utils";

export default function KaryaPage() {
  const d = useKarya();

  const iconBtn =
    "grid h-9 w-9 place-items-center rounded-lg border border-[#FBF6E6]/25 bg-[#14110a]/85 text-[#FBF6E6] transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]";

  const terbit = d.items.filter((k) => k.published).length;

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] lg:min-h-dvh">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Karya Tulis
        </h1>
        <p className="mt-3 max-w-xl text-[#FBF6E6]/70">
          Kelola puisi, cerpen, esai, dan tulisan lain dari anggota IKSAJ.
          Karya yang disembunyikan tidak tampil di halaman publik.
        </p>

        <p className="mt-6 text-sm">
          <span className="font-semibold">{d.items.length} karya</span>
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
            Tambah karya
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
              placeholder="Cari judul, penulis, atau isi"
              aria-label="Cari karya"
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
                <Ico name="pen" className="h-12 w-12" />
              </div>
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-extrabold">
                {d.query || d.category !== "Semua"
                  ? "Tidak ada karya yang cocok"
                  : "Belum ada karya tulis"}
              </p>
              <p className="mt-1 text-sm text-[#FBF6E6]/50">
                {d.query || d.category !== "Semua"
                  ? "Coba kata kunci atau kategori lain."
                  : "Klik Tambah karya untuk mulai menulis."}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {d.listed.map((k) => (
                <li
                  key={k.id}
                  className="flex gap-4 rounded-2xl border-2 border-[#FBF6E6]/10 bg-[#14110a]/70 p-3 transition-colors hover:border-[#FFD21F]/60 sm:p-4"
                >
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#FBF6E6]/5 text-[#FBF6E6]/30 sm:h-24 sm:w-24">
                    {k.cover_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.urlOf(k.cover_path)}
                        alt={k.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Ico name="pen" className="h-7 w-7" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#FFD21F]/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#FFD21F]">
                        {k.category}
                      </span>
                      {!k.published && (
                        <span className="rounded-full border border-[#FBF6E6]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[#FBF6E6]/60">
                          Disembunyikan
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1.5 truncate font-[family-name:var(--font-display)] text-lg font-extrabold">
                      {k.title}
                    </h2>
                    <p className="text-xs text-[#FBF6E6]/50">
                      {k.author} · {formatDate(k.created_at)}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-sm text-[#FBF6E6]/70">
                      {excerpt(k.content)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row sm:items-start">
                    <button
                      type="button"
                      title={k.published ? "Sembunyikan" : "Terbitkan"}
                      aria-label={
                        k.published
                          ? `Sembunyikan ${k.title}`
                          : `Terbitkan ${k.title}`
                      }
                      onClick={() => d.togglePublished(k)}
                      className={iconBtn}
                    >
                      <Ico
                        name={k.published ? "eye" : "eyeOff"}
                        className="h-4 w-4"
                      />
                    </button>
                    <button
                      type="button"
                      title="Ubah"
                      aria-label={`Ubah ${k.title}`}
                      onClick={() => d.setEditing(k)}
                      className={iconBtn}
                    >
                      <Ico name="pen" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Hapus"
                      aria-label={`Hapus ${k.title}`}
                      onClick={() => d.askDelete(k)}
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

      <KaryaForm d={d} />
      <DeleteDialog d={d} />
    </div>
  );
}