"use client";

import { Ico } from "./icons";
import { formatSize } from "./utils";
import type { Drive } from "./useDrive";

export default function StatusBar({ d }: { d: Drive }) {
  const { listed, query, selectedItems, selFiles, selSize, view } = d;

  const tab = (mode: "details" | "icons", label: string, icon: "listView" | "gridView") => (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={view === mode}
      onClick={() => d.setView(mode)}
      className={`grid h-7 w-7 place-items-center rounded-md border transition-colors ${
        view === mode
          ? "border-[#FFD21F]/60 bg-[#FFD21F]/20 text-[#FFD21F]"
          : "border-transparent hover:bg-[#FFD21F]/10"
      }`}
    >
      <Ico name={icon} className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#FFD21F]/15 px-4 py-1.5 text-xs text-[#FBF6E6]/60">
      <p className="min-w-0 truncate">
        {query ? `${listed.length} hasil` : `${listed.length} item`}
        {selectedItems.length > 0 && (
          <>
            <span className="mx-2 text-[#FBF6E6]/25">|</span>
            {selectedItems.length} item dipilih
            {selFiles.length > 0 && ` · ${formatSize(selSize)}`}
          </>
        )}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        {tab("details", "Tampilan detail", "listView")}
        {tab("icons", "Tampilan ikon besar", "gridView")}
      </div>
    </div>
  );
}