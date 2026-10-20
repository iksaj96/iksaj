"use client";

import useGaleri from "./components/useGaleri";
import Lightbox from "./components/Lightbox";
import EditDialog from "./components/EditDialog";
import DeleteDialog from "./components/DeleteDialog";
import { Ico } from "./components/icons";
import { GALERI_QUOTA, formatSize } from "./components/utils";

export default function GaleriPage() {
  const d = useGaleri();

  const pct = Math.min(100, (d.used / GALERI_QUOTA) * 100);
  const anySelected = d.selected.size > 0;
  const allSelected = d.listed.length > 0 && d.selected.size === d.listed.length;

  // tombol aksi di kartu: selalu tampak di layar sentuh, muncul saat hover di desktop
  const reveal = anySelected
    ? "opacity-100"
    : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100";

  const cardBtn =
    "grid h-8 w-8 place-items-center rounded-lg border border-[#FBF6E6]/25 bg-[#14110a]/85 text-[#FBF6E6] transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]";

  return (
    <div
      className="relative min-h-[calc(100dvh-3.5rem)] lg:min-h-dvh"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          d.setDragging(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          d.setDragging(false);
        }
      }}
      onDrop={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        d.setDragging(false);
        d.uploadFiles(Array.from(e.dataTransfer.files));
      }}
    >
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Galeri
        </h1>
        <p className="mt-3 max-w-xl text-[#FBF6E6]/70">
          Unggah dan atur foto kegiatan IKSAJ. Foto dikecilkan otomatis agar
          hemat kuota.
        </p>

        {/* pemakaian jatah */}
        <div className="mt-6 max-w-md">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">{d.items.length} foto</span>
            <span className="text-[#FBF6E6]/60">
              {formatSize(d.used)} dari {formatSize(GALERI_QUOTA)}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#FBF6E6]/10">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${d.used > 0 ? Math.max(pct, 2) : 0}%`,
                background: pct >= 90 ? "#F87171" : "#F97316",
              }}
            />
          </div>
        </div>

        {/* bilah perintah */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={d.openUploadDialog}
            disabled={!!d.busy}
            className="inline-flex items-center gap-2 rounded-full bg-[#FFD21F] px-5 py-2.5 text-sm font-bold text-[#14110a] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
          >
            <Ico name="upload" />
            Unggah foto
          </button>

          {d.listed.length > 0 && (
            <button
              type="button"
              onClick={allSelected ? d.clearSelection : d.selectAll}
              className="rounded-full border border-[#FBF6E6]/25 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]"
            >
              {allSelected ? "Batal pilih semua" : "Pilih semua"}
            </button>
          )}

          {anySelected && (
            <>
              <span className="px-1 text-sm text-[#FBF6E6]/60">
                {d.selected.size} dipilih
              </span>
              <button
                type="button"
                onClick={() => d.askDelete(d.selectedItems)}
                className="inline-flex items-center gap-2 rounded-full border border-red-400/50 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-400/10"
              >
                <Ico name="trash" />
                Hapus ({d.selected.size})
              </button>
              <button
                type="button"
                onClick={d.clearSelection}
                className="rounded-full px-3 py-2.5 text-sm font-semibold text-[#FBF6E6]/60 transition-colors hover:text-[#FFD21F]"
              >
                Batal
              </button>
            </>
          )}

          <div className="ml-auto flex w-full items-center gap-2 rounded-full border border-[#FBF6E6]/15 bg-[#14110a]/60 px-3.5 transition-colors focus-within:border-[#FFD21F] sm:w-64">
            <Ico name="search" className="h-4 w-4 text-[#FBF6E6]/50" />
            <input
              type="search"
              value={d.query}
              onChange={(e) => d.setQuery(e.target.value)}
              placeholder="Cari judul atau keterangan"
              aria-label="Cari foto"
              className="w-full min-w-0 bg-transparent py-2.5 text-sm outline-none placeholder:text-[#FBF6E6]/30"
            />
          </div>
        </div>

        {/* pesan */}
        {d.busy && (
          <p
            role="status"
            className="mt-4 rounded-2xl border border-[#FFD21F]/30 bg-[#FFD21F]/10 px-4 py-2.5 text-sm text-[#FFD21F]"
          >
            {d.busy}
          </p>
        )}
        {d.error && (
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
                <Ico name="image" className="h-12 w-12" />
              </div>
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-extrabold">
                {d.query ? "Tidak ada foto yang cocok" : "Belum ada foto"}
              </p>
              <p className="mt-1 text-sm text-[#FBF6E6]/50">
                {d.query
                  ? "Coba kata kunci lain."
                  : "Seret foto ke halaman ini atau klik Unggah foto."}
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]">
              {d.listed.map((p) => {
                const sel = d.selected.has(p.id);
                return (
                  <li
                    key={p.id}
                    className={`group relative overflow-hidden rounded-2xl border-2 bg-[#14110a]/70 transition-colors ${
                      sel
                        ? "border-[#FFD21F]"
                        : "border-[#FBF6E6]/10 hover:border-[#FFD21F]/60"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => d.setLightbox(p.id)}
                      aria-label={`Lihat foto ${p.title}`}
                      className="block aspect-square w-full overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={d.urlOf(p)}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2.5 pt-10">
                      <p className="truncate text-xs font-semibold">{p.title}</p>
                      <p className="text-[10px] text-[#FBF6E6]/60">
                        {formatSize(p.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={sel}
                      aria-label={`Pilih ${p.title}`}
                      onClick={() => d.toggleSelect(p.id)}
                      className={`absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-lg border-2 transition-colors ${reveal} ${
                        sel
                          ? "border-[#FFD21F] bg-[#FFD21F] text-[#14110a]"
                          : "border-[#FBF6E6]/60 bg-[#14110a]/70 text-transparent hover:border-[#FFD21F]"
                      }`}
                    >
                      <Ico name="check" className="h-4 w-4" />
                    </button>

                    <div
                      className={`absolute right-2 top-2 flex gap-1.5 transition-opacity ${reveal}`}
                    >
                      <button
                        type="button"
                        title="Ubah detail"
                        aria-label={`Ubah detail ${p.title}`}
                        onClick={() => d.setEditing(p)}
                        className={cardBtn}
                      >
                        <Ico name="pen" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Hapus"
                        aria-label={`Hapus ${p.title}`}
                        onClick={() => d.askDelete([p])}
                        className={`${cardBtn} hover:!border-red-300 hover:!text-red-300`}
                      >
                        <Ico name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* lapisan seret-dan-lepas */}
      {d.dragging && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-[#14110a]/85">
          <div className="rounded-[2rem] border-4 border-dashed border-[#FFD21F] px-10 py-10 text-center">
            <Ico name="upload" className="mx-auto h-10 w-10 text-[#FFD21F]" />
            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold">
              Lepaskan untuk mengunggah
            </p>
            <p className="mt-1 text-sm text-[#FBF6E6]/60">ke Galeri</p>
          </div>
        </div>
      )}

      <input
        ref={d.fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          d.uploadFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />

      <Lightbox d={d} />
      <EditDialog d={d} />
      <DeleteDialog d={d} />
    </div>
  );
}