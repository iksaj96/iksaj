"use client";

import { useEffect, useRef, useState } from "react";
import { FolderIcon, Ico, ItemIcon } from "./icons";
import type { Item, SortKey } from "./types";
import { GRID, formatDate, formatSize, typeLabel } from "./utils";
import type { Drive } from "./useDrive";

function RenameInput({
  initial,
  isFile,
  center,
  onCommit,
  onCancel,
}: {
  initial: string;
  isFile: boolean;
  center?: boolean;
  onCommit: (v: string) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState(initial);
  const done = useRef(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const dot = initial.lastIndexOf(".");
    if (isFile && dot > 0) el.setSelectionRange(0, dot);
    else el.select();
    el.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = (ok: boolean) => {
    if (done.current) return;
    done.current = true;
    if (ok) onCommit(v);
    else onCancel();
  };

  return (
    <input
      ref={ref}
      value={v}
      maxLength={200}
      aria-label="Nama baru"
      onChange={(e) => setV(e.target.value)}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") {
          e.preventDefault();
          finish(true);
        } else if (e.key === "Escape") {
          e.preventDefault();
          finish(false);
        }
      }}
      onBlur={() => finish(true)}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
      onDragStart={(e) => e.preventDefault()}
      className={`w-full min-w-0 rounded border border-[#FFD21F] bg-[#14110a] px-1.5 py-0.5 text-sm outline-none ${
        center ? "text-center" : ""
      }`}
    />
  );
}

export default function FileList({ d }: { d: Drive }) {
  const { listed, query, view } = d;

  const stateCls = (it: Item) =>
    d.dropHover === it.id
      ? "border-[#FFD21F] bg-[#FFD21F]/30"
      : d.selected.has(it.id)
        ? "border-[#FFD21F]/60 bg-[#FFD21F]/20"
        : "border-transparent hover:bg-[#FFD21F]/10";

  const nameCell = (it: Item, center = false) =>
    d.renamingId === it.id ? (
      <RenameInput
        initial={it.name}
        isFile={!it.is_folder}
        center={center}
        onCommit={(v) => d.commitRename(it, v)}
        onCancel={d.cancelRename}
      />
    ) : null;

  const headCell = (key: SortKey, label: string, right = false) => (
    <button
      type="button"
      onClick={() => {
        if (d.sortKey === key) d.setSortAsc((v) => !v);
        else {
          d.setSortKey(key);
          d.setSortAsc(true);
        }
      }}
      className={`flex items-center gap-1.5 border-l border-[#FBF6E6]/10 py-1.5 text-xs font-semibold transition-colors hover:bg-[#FFD21F]/10 hover:text-[#FFD21F] ${
        right ? "justify-end pr-2" : ""
      } ${key === "name" ? "border-l-0 pl-0" : "pl-3"} ${
        d.sortKey === key ? "text-[#FFD21F]" : "text-[#FBF6E6]/60"
      }`}
    >
      {label}
      {d.sortKey === key && (
        <Ico
          name="chevronDown"
          className={`h-3 w-3 ${d.sortAsc ? "rotate-180" : ""}`}
        />
      )}
    </button>
  );

  return (
    <div
      className="relative flex min-w-0 flex-1 flex-col"
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
      {view === "details" && (
        <div
          className={`hidden border-b border-[#FFD21F]/15 px-3.5 sm:grid ${GRID}`}
        >
          {headCell("name", "Nama")}
          {headCell("updated_at", "Tanggal diubah")}
          {headCell("type", "Jenis")}
          {headCell("size", "Ukuran", true)}
        </div>
      )}

      <div
        role="listbox"
        aria-multiselectable="true"
        aria-label="Isi folder"
        className="flex-1 overflow-auto py-1"
        onClick={d.clearSelection}
        onContextMenu={d.handleBlankContext}
      >
        {!d.loaded ? (
          <p className="px-4 py-16 text-center text-sm text-[#FBF6E6]/50">
            Memuat...
          </p>
        ) : listed.length === 0 ? (
          <div className="px-4 py-20 text-center">
            <div className="flex justify-center">
              <FolderIcon h={56} />
            </div>
            <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-extrabold">
              {query ? "Tidak ada item yang cocok" : "Folder ini kosong"}
            </p>
            <p className="mt-1 text-sm text-[#FBF6E6]/50">
              {query
                ? "Coba kata kunci lain."
                : "Seret berkas ke sini atau klik Unggah."}
            </p>
          </div>
        ) : view === "details" ? (
          listed.map((it) => (
            <div
              key={it.id}
              {...d.rowProps(it)}
              className={`mx-1.5 my-px grid cursor-default select-none items-center rounded-md border px-2 py-1.5 transition-colors ${GRID} ${stateCls(it)}`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid w-8 shrink-0 place-items-center">
                  <ItemIcon it={it} h={it.is_folder ? 22 : 26} />
                </span>
                <span className="min-w-0 flex-1">
                  {nameCell(it) ?? (
                    <span className="block truncate text-sm font-medium">
                      {it.name}
                    </span>
                  )}
                  {query && (
                    <span className="block truncate text-[11px] text-[#FBF6E6]/40">
                      {d.pathOf(it)}
                    </span>
                  )}
                  <span className="block text-[11px] text-[#FBF6E6]/40 sm:hidden">
                    {it.is_folder ? "Folder" : formatSize(it.size)} ·{" "}
                    {formatDate(it.updated_at)}
                  </span>
                </span>
              </div>
              <span className="hidden truncate pl-3 text-xs text-[#FBF6E6]/60 sm:block">
                {formatDate(it.updated_at)}
              </span>
              <span className="hidden truncate pl-3 text-xs text-[#FBF6E6]/60 sm:block">
                {typeLabel(it)}
              </span>
              <span className="hidden pr-2 text-right text-xs text-[#FBF6E6]/60 sm:block">
                {it.is_folder ? "" : formatSize(it.size)}
              </span>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1.5 p-2">
            {listed.map((it) => (
              <div
                key={it.id}
                {...d.rowProps(it)}
                className={`flex cursor-default select-none flex-col items-center gap-1.5 rounded-lg border px-2 pb-2 pt-3 transition-colors ${stateCls(it)}`}
              >
                <span className="grid h-14 place-items-center">
                  <ItemIcon it={it} h={it.is_folder ? 46 : 54} />
                </span>
                {nameCell(it, true) ?? (
                  <span className="line-clamp-2 w-full break-words text-center text-xs font-medium leading-snug">
                    {it.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* lapisan seret-dan-lepas */}
      {d.dragging && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-[#14110a]/85">
          <div className="rounded-[2rem] border-4 border-dashed border-[#FFD21F] px-10 py-10 text-center">
            <Ico name="upload" className="mx-auto h-10 w-10 text-[#FFD21F]" />
            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold">
              Lepaskan untuk mengunggah
            </p>
            <p className="mt-1 text-sm text-[#FBF6E6]/60">ke {d.currentName}</p>
          </div>
        </div>
      )}
    </div>
  );
}