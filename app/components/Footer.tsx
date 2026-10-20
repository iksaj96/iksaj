"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./ui";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() =>
      setYear(new Date().getFullYear())
    );
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <footer className="border-t border-[#FFD21F]/20 py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex items-center gap-4">
            <Logo size={52} className="bg-[#14110a]" />
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[#FBF6E6]">
                IKSAJ
              </p>
              <p className="mt-1 text-sm text-[#FBF6E6]/70">
                Ikatan Santri Annuqayah Daerah Lubangsa
              </p>
              <p className="mt-2 text-xs text-[#FBF6E6]/45">
                Merawat Persaudaraan, Mengembangkan Potensi
              </p>
            </div>
          </div>

          <nav
            aria-label="Navigasi footer"
            className="flex flex-col items-center gap-5 sm:col-span-2 sm:items-start lg:col-span-1"
          >
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD21F]">
                Navigasi
              </p>
              <Link
                href="/"
                className="text-sm text-[#FBF6E6] hover:underline"
              >
                Beranda
              </Link>
              <Link
                href="/admin/login"
                prefetch={false}
                className="mt-2 block text-sm text-[#FBF6E6] hover:underline"
              >
                Login Admin
              </Link>
            </div>
            <div className="grid w-full grid-cols-2 gap-6 text-left">
              <div className="flex flex-col items-start gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FFD21F]">
                  Tentang
                </p>
                <Link href="/tentang" className="text-sm text-[#FBF6E6] hover:underline">
                  Tentang Kami
                </Link>
                <Link href="/sejarah" className="text-sm text-[#FBF6E6] hover:underline">
                  Sejarah
                </Link>
                <Link href="/visi-misi" className="text-sm text-[#FBF6E6] hover:underline">
                  Visi &amp; Misi
                </Link>
                <Link href="/struktur" className="text-sm text-[#FBF6E6] hover:underline">
                  Struktur
                </Link>
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FFD21F]">
                  Publikasi
                </p>
                <Link href="/berita" className="text-sm text-[#FBF6E6] hover:underline">
                  Berita
                </Link>
                <Link href="/karya" className="text-sm text-[#FBF6E6] hover:underline">
                  Karya Tulis
                </Link>
                <Link href="/galeri" className="text-sm text-[#FBF6E6] hover:underline">
                  Galeri
                </Link>
              </div>
            </div>
          </nav>

          <div className="flex flex-col items-center gap-3 sm:items-start lg:items-end">
            <p className="text-xs uppercase tracking-[0.2em] text-[#FBF6E6]/45">
              Developed by
            </p>
            <p className="font-semibold text-[#FBF6E6]">
              Adlan Madjied Ridho
            </p>
            <a
              href="https://adlanmr.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#FFD21F] px-4 py-2 text-xs font-bold text-[#14110a] transition-colors hover:bg-[#FBF6E6]"
            >
              Visit me on adlanmr.vercel.app
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                className="h-3.5 w-3.5"
              >
                <path
                  d="M4 12 12 4M5 4h7v7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#FBF6E6]/10 pt-5 text-center text-xs text-[#FBF6E6]/45 sm:flex-row sm:text-left">
          <p className="max-w-2xl">
            Informasi bersumber dari laman resmi PP. Annuqayah Lubangsa. ©{" "}
            {year} IKSAJ.
          </p>
          <p>IKSAJ</p>
        </div>
      </div>
    </footer>
  );
}