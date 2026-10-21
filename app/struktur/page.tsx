"use client";

import { useRef } from "react";

export function Modal({
  title,
  trigger,
  triggerClassName,
  children,
}: {
  title: string;
  trigger: React.ReactNode;
  triggerClassName?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  function resetForm() {
    ref.current?.querySelectorAll("form").forEach((form) => form.reset());
  }

  function tutup() {
    ref.current?.close();
  }

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => ref.current?.showModal()}
      >
        {trigger}
      </button>

      <dialog
        ref={ref}
        onClose={resetForm}
        onClick={(event) => {
          // klik di area gelap (di luar kotak) menutup modal
          if (event.target === ref.current) tutup();
        }}
        // Form sudah terkirim; beri waktu sebentar lalu tutup modal
        onSubmit={() => window.setTimeout(tutup, 400)}
        className="m-auto max-h-[88vh] w-[min(92vw,34rem)] overflow-y-auto rounded-3xl border border-[#FBF6E6]/15 bg-[#14110a] p-0 text-[#FBF6E6] shadow-2xl backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#FBF6E6]/10 px-5 py-4">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-extrabold">
            {title}
          </h2>
          <button
            type="button"
            onClick={tutup}
            aria-label="Tutup"
            className="grid h-8 w-8 place-items-center rounded-full text-[#FBF6E6]/55 transition-colors hover:bg-[#FBF6E6]/10 hover:text-[#FFD21F]"
          >
            ✕
          </button>
        </div>

        <div className="p-5">{children}</div>
      </dialog>
    </>
  );
}