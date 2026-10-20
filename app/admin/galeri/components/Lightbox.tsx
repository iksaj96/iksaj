"use client";

import { useCallback, useEffect, useState } from "react";
import { Ico } from "./icons";
import { formatDate, formatSize } from "./utils";
import type { Galeri } from "./useGaleri";

export default function Lightbox({ d }: { d: Galeri }) {
  const { listed, lightbox, setLightbox } = d;
  const [copied, setCopied] = useState(false);

  const idx = lightbox ? listed.findIndex((p) => p.id === lightbox) : -1;
  const p = idx >= 0 ? listed[idx] : null;

  const step = useCallback(
    (dir: number) => {
      if (!listed.length || idx < 0) return;
      const n = (idx + dir + listed.length) % listed.length;
      setLightbox(listed[n].id);
      setCopied(false);
    },
    [listed, idx, setLightbox]
  );

  useEffect(() => {
    if (!p) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [p, step, setLightbox]);

  if (!p) return null;

  const url = d.urlOf(p);
  const many = listed.length > 1;

  const navBtn =
    "absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#FBF6E6]/25 bg-[#14110a]/80 text-[#FBF6E6] transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
    >
      <button
        type="button"
        aria-label="Tutup"
        onClick={() => setLightbox(null)}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm text-[#FBF6E6]/60">
          {idx + 1} dari {listed.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                ?.writeText(url)
                .then(() => setCopied(true))
                .catch(() => setCopied(false));
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[#FBF6E6]/25 px-4 py-2 text-sm font-semibold transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]"
          >
            <Ico name={copied ? "check" : "link"} className="h-4 w-4" />
            {copied ? "Tautan disalin" : "Salin tautan"}
          </button>
          <button
            type="button"
            aria-label="Tutup"
            onClick={() => setLightbox(null)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#FBF6E6]/25 transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]"
          >
            <Ico name="close" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none relative z-0 flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={p.id}
          src={url}
          alt={p.title}
          className="pointer-events-auto max-h-full max-w-full rounded-lg object-contain"
        />
      </div>

      {many && (
        <>
          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={() => step(-1)}
            className={`${navBtn} left-3`}
          >
            <Ico name="left" />
          </button>
          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={() => step(1)}
            className={`${navBtn} right-3`}
          >
            <Ico name="right" />
          </button>
        </>
      )}

      <div className="pointer-events-none relative z-10 px-4 pb-5 pt-3 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl font-extrabold">
          {p.title}
        </p>
        {p.caption && (
          <p className="mx-auto mt-1 max-w-2xl text-sm text-[#FBF6E6]/70">
            {p.caption}
          </p>
        )}
        <p className="mt-1 text-xs text-[#FBF6E6]/40">
          {formatDate(p.created_at)} · {formatSize(p.size)}
          {p.width && p.height ? ` · ${p.width}×${p.height}` : ""}
        </p>
      </div>
    </div>
  );
}