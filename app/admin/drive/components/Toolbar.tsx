"use client";

import { Ico, type IconName } from "./icons";
import type { Drive } from "./useDrive";
import type { SortKey } from "./types";

function CmdBtn({
  icon,
  label,
  onClick,
  disabled,
  accent,
  danger,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
        accent
          ? "bg-[#FFD21F] text-[#14110a] enabled:hover:bg-[#FFB000]"
          : danger
            ? "text-red-300 enabled:hover:bg-red-400/10"
            : "text-[#FBF6E6]/85 enabled:hover:bg-[#FFD21F]/10 enabled:hover:text-[#FFD21F]"
      }`}
    >
      <Ico name={icon} />
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
}

function NavBtn({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#FBF6E6]/80 transition-colors disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:bg-[#FFD21F]/10 enabled:hover:text-[#FFD21F]"
    >
      <Ico name={icon} />
    </button>
  );
}

export default function Toolbar({ d }: { d: Drive }) {
  const { single, selFiles, selectedItems } = d;

  return (
    <>
      {/* BILAH PERINTAH */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#FFD21F]/15 px-3 py-2">
        <CmdBtn icon="folderPlus" label="Folder baru" accent onClick={d.newFolder} />
        <CmdBtn
          icon="upload"
          label="Unggah"
          disabled={!!d.busy}
          onClick={d.openUploadDialog}
        />
        <span className="mx-1 h-5 w-px bg-[#FBF6E6]/15" />
        <CmdBtn
          icon="external"
          label="Buka"
          disabled={!single}
          onClick={() => single && d.openItem(single)}
        />
        <CmdBtn
          icon="download"
          label="Unduh"
          disabled={!selFiles.length}
          onClick={d.downloadSelected}
        />
        <CmdBtn
          icon="pen"
          label="Ubah nama"
          disabled={!single}
          onClick={d.startRename}
        />
        <CmdBtn
          icon="trash"
          label="Hapus"
          danger
          disabled={!selectedItems.length}
          onClick={() => d.askDelete(selectedItems)}
        />

        <div className="ml-auto flex items-center gap-1">
          <select
            aria-label="Urutkan berdasarkan"
            value={d.sortKey}
            onChange={(e) => d.setSortKey(e.target.value as SortKey)}
            className="rounded-lg border border-[#FBF6E6]/20 bg-[#14110a] px-2 py-1.5 text-xs font-semibold text-[#FBF6E6]/80 outline-none focus:border-[#FFD21F]"
          >
            <option value="name">Nama</option>
            <option value="updated_at">Tanggal diubah</option>
            <option value="type">Jenis</option>
            <option value="size">Ukuran</option>
          </select>
          <button
            type="button"
            title={d.sortAsc ? "Urut naik" : "Urut turun"}
            aria-label={d.sortAsc ? "Urut naik" : "Urut turun"}
            onClick={() => d.setSortAsc((v) => !v)}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#FBF6E6]/80 transition-colors hover:bg-[#FFD21F]/10 hover:text-[#FFD21F]"
          >
            <Ico name="up" className={d.sortAsc ? "" : "rotate-180"} />
          </button>
        </div>
      </div>

      {/* BILAH ALAMAT */}
      <div className="flex items-center gap-1.5 border-b border-[#FFD21F]/15 px-3 py-2">
        <NavBtn icon="back" label="Mundur" disabled={d.hi <= 0} onClick={d.goBack} />
        <NavBtn
          icon="forward"
          label="Maju"
          disabled={d.hi >= d.histLen - 1}
          onClick={d.goForward}
        />
        <NavBtn
          icon="up"
          label="Naik satu tingkat"
          disabled={d.currentId === null}
          onClick={d.goUp}
        />
        <NavBtn icon="refresh" label="Segarkan" onClick={d.refresh} />

        <nav
          aria-label="Lokasi folder"
          className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto rounded-lg border border-[#FBF6E6]/15 bg-[#FBF6E6]/5 px-2 py-1 [scrollbar-width:none]"
        >
          {d.crumbs.map((c, i) => {
            const last = i === d.crumbs.length - 1;
            const key = c.id ?? "root";
            return (
              <span key={key} className="flex shrink-0 items-center gap-0.5">
                {i > 0 && (
                  <Ico
                    name="chevronRight"
                    className="h-3 w-3 text-[#FBF6E6]/30"
                  />
                )}
                <button
                  type="button"
                  onClick={() => d.navigate(c.id)}
                  aria-current={last ? "page" : undefined}
                  className={`rounded-md border px-2 py-0.5 text-sm transition-colors ${
                    d.dropHover === key
                      ? "border-[#FFD21F] bg-[#FFD21F]/30"
                      : "border-transparent hover:bg-[#FFD21F]/10 hover:text-[#FFD21F]"
                  } ${last ? "font-bold" : "text-[#FBF6E6]/70"}`}
                  {...d.dropProps(c.id)}
                >
                  {c.name}
                </button>
              </span>
            );
          })}
        </nav>

        <div className="flex w-36 shrink-0 items-center gap-2 rounded-lg border border-[#FBF6E6]/15 bg-[#FBF6E6]/5 px-2.5 transition-colors focus-within:border-[#FFD21F] sm:w-56">
          <Ico name="search" className="h-4 w-4 text-[#FBF6E6]/50" />
          <input
            type="search"
            value={d.query}
            onChange={(e) => d.setQuery(e.target.value)}
            placeholder={`Cari di ${d.currentName}`}
            aria-label="Cari berkas"
            className="w-full min-w-0 bg-transparent py-1.5 text-sm outline-none placeholder:text-[#FBF6E6]/30"
          />
        </div>
      </div>

      {/* PESAN */}
      {d.busy && (
        <p
          role="status"
          className="border-b border-[#FFD21F]/30 bg-[#FFD21F]/10 px-4 py-1.5 text-sm text-[#FFD21F]"
        >
          {d.busy}
        </p>
      )}
      {d.error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 border-b border-red-400/40 bg-red-400/10 px-4 py-1.5 text-sm text-red-300"
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
    </>
  );
}