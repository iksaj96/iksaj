"use client";

import { useEffect, useRef } from "react";
import { Ico, type IconName } from "./icons";
import type { Drive } from "./useDrive";

type Entry =
  | "sep"
  | {
      label: string;
      hint?: string;
      icon: IconName;
      onClick: () => void;
      danger?: boolean;
    };

export default function ContextMenu({ d }: { d: Drive }) {
  const { menu, setMenu, single, selFiles, selectedItems } = d;
  const ref = useRef<HTMLDivElement>(null);

  // tutup menu saat klik di luar, Escape, atau jendela berubah
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const down = (e: PointerEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      close();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("keydown", key);
    window.addEventListener("resize", close);
    window.addEventListener("blur", close);
    document.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", close);
      window.removeEventListener("blur", close);
      document.removeEventListener("scroll", close, true);
    };
  }, [menu, setMenu]);

  if (!menu) return null;

  const entries: Entry[] = [];
  if (menu.onItem) {
    if (single) {
      entries.push({
        label: "Buka",
        hint: "Enter",
        icon: single.is_folder ? "folderPlus" : "external",
        onClick: () => d.openItem(single),
      });
    }
    if (selFiles.length) {
      entries.push({
        label: selFiles.length > 1 ? `Unduh (${selFiles.length})` : "Unduh",
        icon: "download",
        onClick: d.downloadSelected,
      });
    }
    if (single) {
      entries.push({
        label: "Ubah nama",
        hint: "F2",
        icon: "pen",
        onClick: d.startRename,
      });
    }
    entries.push("sep", {
      label:
        selectedItems.length > 1 ? `Hapus (${selectedItems.length})` : "Hapus",
      hint: "Del",
      icon: "trash",
      danger: true,
      onClick: () => d.askDelete(selectedItems),
    });
  } else {
    entries.push(
      { label: "Folder baru", icon: "folderPlus", onClick: d.newFolder },
      { label: "Unggah berkas", icon: "upload", onClick: d.openUploadDialog },
      "sep",
      { label: "Segarkan", icon: "refresh", onClick: d.refresh }
    );
  }

  return (
    <div
      ref={ref}
      role="menu"
      style={{ left: menu.x, top: menu.y }}
      className="fixed z-50 w-52 rounded-xl border border-[#FFD21F]/40 bg-[#14110a] p-1.5 shadow-[4px_4px_0_0_#FFD21F]"
    >
      {entries.map((m, i) =>
        m === "sep" ? (
          <div key={i} className="my-1 h-px bg-[#FFD21F]/20" />
        ) : (
          <button
            key={m.label}
            type="button"
            role="menuitem"
            onClick={() => {
              setMenu(null);
              m.onClick();
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              m.danger
                ? "text-red-300 hover:bg-red-400/15"
                : "hover:bg-[#FFD21F] hover:text-[#14110a]"
            }`}
          >
            <Ico name={m.icon} className="h-4 w-4" />
            <span className="flex-1">{m.label}</span>
            {m.hint && <span className="text-[10px] opacity-50">{m.hint}</span>}
          </button>
        )
      )}
    </div>
  );
}