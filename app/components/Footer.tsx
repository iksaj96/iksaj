
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./ui";

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const icons: Record<string, React.ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-7h6v7" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),
    newspaper: (
      <>
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8M8 12h8M8 16h4" />
        <path d="M2 7v12a2 2 0 0 0 2 2" />
      </>
    ),
    pen: (
      <>
        <path d="m15 5 4 4" />
        <path d="M4 20l4.5-1 11-11a2.8 2.8 0 0 0-4-4l-11 11Z" />
      </>
    ),
    images: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    external: (
      <>
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      {...common}
    >
      {icons[name] ?? icons.info}
    </svg>
  );
}

const footerGroups = [
  {
    title: "Tentang",
    icon: "users",
    links: [
      { label: "Tentang Kami", href: "/tentang", icon: "info" },
      { label: "Sejarah", href: "/sejarah", icon: "history" },
      { label: "Visi & Misi", href: "/visi-misi", icon: "target" },
      { label: "Struktur", href: "/struktur", icon: "users" },
    ],
  },
  {
    title: "Publikasi",
    icon: "book",
    links: [
      { label: "Berita", href: "/berita", icon: "newspaper" },
      { label: "Karya Tulis", href: "/karya", icon: "pen" },
      { label: "Galeri", href: "/galeri", icon: "images" },
    ],
  },
];

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setYear(new Date().getFullYear());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-[#FFD21F]/20 bg-[#14110a] text-[#FBF6E6]">
      {/* Aksen dekoratif tanpa blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-bl-full border-b border-l border-[#FFD21F]/10"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-6 pt-12 sm:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
          {/* IDENTITAS ORGANISASI */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Link
              href="/"
              aria-label="IKSAJ — Beranda"
              className="group inline-flex items-center gap-3"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#FFD21F]/20 bg-[#FBF6E6]/[0.04] transition-colors group-hover:border-[#FFD21F]/60">
                <Logo size={44} className="bg-transparent" />
              </span>

              <span className="text-left">
                <span className="block font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight">
                  IKSAJ
                </span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD21F]">
                  Ikatan Santri
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#FBF6E6]/65">
              Ikatan Santri Annuqayah Daerah Lubangsa. Wadah
              silaturahmi, pengembangan potensi, dan penguatan
              persaudaraan santri Annuqayah Jawa.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#FFD21F]/20 bg-[#FFD21F]/[0.05] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#FFD21F]" />
              <span className="text-[10px] font-semibold tracking-wide text-[#FBF6E6]/70">
                Merawat Persaudaraan, Mengembangkan Potensi
              </span>
            </div>
          </div>

          {/* NAVIGASI */}
          <div className="grid grid-cols-2 gap-5 sm:col-span-1 lg:col-span-1">
            {footerGroups.map((group) => (
              <nav
                key={group.title}
                aria-label={`Navigasi ${group.title}`}
                className="min-w-0"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#FFD21F]/10 text-[#FFD21F]">
                    <Icon name={group.icon} className="h-4 w-4" />
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-[0.13em] text-[#FFD21F]">
                    {group.title}
                  </h2>
                </div>

                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex max-w-full items-center gap-2 text-sm text-[#FBF6E6]/65 transition-colors hover:text-[#FFD21F]"
                      >
                        <Icon
                          name={link.icon}
                          className="h-4 w-4 shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                        />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* TAUTAN PENTING DAN PENGEMBANG */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:items-start">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#FFD21F]">
              Tautan Penting
            </h2>

            <Link
              href="/"
              className="group flex w-full max-w-sm items-center gap-3 rounded-2xl border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.025] p-3 transition-colors hover:border-[#FFD21F]/30 hover:bg-[#FFD21F]/[0.05]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFD21F]/10 text-[#FFD21F]">
                <Icon name="home" />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-semibold">
                  Beranda
                </span>
                <span className="mt-1 block text-xs text-[#FBF6E6]/45">
                  Halaman utama IKSAJ
                </span>
              </span>
              <Icon
                name="arrow"
                className="h-4 w-4 shrink-0 text-[#FBF6E6]/35 transition-colors group-hover:text-[#FFD21F]"
              />
            </Link>

            <Link
              href="/admin/login"
              prefetch={false}
              className="group mt-3 flex w-full max-w-sm items-center gap-3 rounded-2xl border border-[#FFD21F]/20 bg-[#FFD21F]/[0.04] p-3 transition-colors hover:bg-[#FFD21F]/10"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFD21F] text-[#14110a]">
                <Icon name="lock" />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-semibold">
                  Login Admin
                </span>
                <span className="mt-1 block text-xs text-[#FBF6E6]/45">
                  Area pengelolaan situs
                </span>
              </span>
              <Icon
                name="arrow"
                className="h-4 w-4 shrink-0 text-[#FBF6E6]/35 transition-colors group-hover:text-[#FFD21F]"
              />
            </Link>

            <div className="mt-7 w-full max-w-sm border-t border-[#FBF6E6]/10 pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FBF6E6]/40">
                Dikembangkan oleh
              </p>

              <p className="mt-2 font-[family-name:var(--font-display)] text-base font-bold">
                Adlan Madjied Ridho
              </p>

              <a
                href="https://adlanmr.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex max-w-full items-center justify-center gap-2 rounded-full bg-[#FFD21F] px-4 py-2.5 text-xs font-bold text-[#14110a] transition-colors hover:bg-[#FBF6E6] sm:justify-start"
              >
                <span>Kunjungi situs pengembang</span>
                <Icon name="external" className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-10 border-t border-[#FBF6E6]/10 pt-5 sm:mt-12">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="max-w-2xl text-xs leading-6 text-[#FBF6E6]/45">
              Informasi bersumber dari laman resmi PP. Annuqayah
              Lubangsa. © {year ?? "IKSAJ"} IKSAJ. Hak cipta
              dilindungi.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#FBF6E6]/60 transition-colors hover:text-[#FFD21F]"
            >
              <Logo size={24} className="bg-transparent" />
              <span>IKSAJ</span>
              <span className="text-[#FFD21F]">•</span>
              <span>Annuqayah</span>
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-[#FBF6E6]/35 sm:justify-start">
            Dibangun dengan
            <Icon name="heart" className="h-3 w-3 text-[#FFD21F]" />
            untuk keluarga besar IKSAJ
          </div>
        </div>
      </div>
    </footer>
  );
}
