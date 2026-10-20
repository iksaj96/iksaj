"use client";

import type { Drive } from "./useDrive";

export default function DeleteDialog({ d }: { d: Drive }) {
  const list = d.toDelete;
  if (!list) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-5">
      <button
        type="button"
        aria-label="Tutup"
        onClick={d.cancelDelete}
        className="absolute inset-0 bg-black/70"
      />
      <form
        onSubmit={d.doDelete}
        role="alertdialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-3xl border-2 border-[#FFD21F] bg-[#14110a] p-6 shadow-[6px_6px_0_0_#FFD21F]"
      >
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight">
          Hapus permanen?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#FBF6E6]/70">
          {list.length === 1 ? (
            <>
              <span className="font-bold text-[#FBF6E6]">{list[0].name}</span>{" "}
              {list[0].is_folder
                ? "beserta seluruh isinya akan dihapus dan tidak bisa dikembalikan."
                : "akan dihapus dan tidak bisa dikembalikan."}
            </>
          ) : (
            <>
              <span className="font-bold text-[#FBF6E6]">{list.length} item</span>{" "}
              akan dihapus (folder beserta isinya) dan tidak bisa dikembalikan.
            </>
          )}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={d.cancelDelete}
            className="rounded-full border border-[#FBF6E6]/30 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]"
          >
            Batal
          </button>
          <button
            type="submit"
            autoFocus
            disabled={d.deleting}
            className="rounded-full bg-red-400 px-5 py-2.5 text-sm font-bold text-[#14110a] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
          >
            {d.deleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </form>
    </div>
  );
}