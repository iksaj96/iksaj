"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "./ui";

type NavChild = { href: string; label: string; desc: string };
type NavItem =
  | { label: string; href: string }
  | { label: string; children: NavChild[] };

const NAV: NavItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Tentang",
    children: [
      { href: "/tentang", label: "Tentang Kami", desc: "Mengenal IKSAJ" },
      { href: "/sejarah", label: "Sejarah", desc: "Perjalanan sejak 1996" },
      { href: "/visi-misi", label: "Visi & Misi", desc: "Arah langkah organisasi" },
      { href: "/struktur", label: "Struktur", desc: "Susunan pengurus" },
    ],
  },
  {
    label: "Publikasi",
    children: [
      { href: "/berita", label: "Berita", desc: "Kabar terbaru IKSAJ" },
      { href: "/karya", label: "Karya Tulis", desc: "Tulisan anggota" },
      { href: "/galeri", label: "Galeri", desc: "Dokumentasi kegiatan" },
    ],
  },
];

const ADMIN_LOGIN_HREF = "/admin/login";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const [mobSub, setMobSub] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting)
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDrop(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrop(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeAll = () => {
    setDrop(null);
    setMenuOpen(false);
    setMobSub(null);
  };

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="absolute left-0 top-0 h-6 w-full" />

      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[padding,background-color] duration-300 ${
          scrolled || menuOpen
            ? "border-b border-[#FFD21F]/20 bg-[#14110a] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/" onClick={closeAll} className="flex items-center gap-2.5">
            <Logo size={40} className="bg-transparent" />
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              IKSAJ
            </span>
          </Link>

          {/* desktop */}
          <ul ref={navRef} className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) =>
              "children" in n ? (
                <li
                  key={n.label}
                  className="relative"
                  onMouseEnter={() => setDrop(n.label)}
                  onMouseLeave={() => setDrop(null)}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={drop === n.label}
                    onClick={() => setDrop(drop === n.label ? null : n.label)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-[#FFD21F] hover:text-[#14110a] ${
                      drop === n.label
                        ? "bg-[#FFD21F] text-[#14110a]"
                        : "text-[#FBF6E6]/80"
                    }`}
                  >
                    {n.label}
                    <Chevron open={drop === n.label} />
                  </button>

                  {drop === n.label && (
                    <div className="absolute left-0 top-full pt-2">
                      <ul
                        role="menu"
                        className="w-64 rounded-2xl border border-[#FFD21F]/30 bg-[#14110a] p-2 shadow-[6px_6px_0_0_#FFD21F]"
                      >
                        {n.children.map((c) => (
                          <li key={c.href} role="none">
                            <Link
                              role="menuitem"
                              href={c.href}
                              onClick={closeAll}
                              className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-[#FFD21F] hover:text-[#14110a]"
                            >
                              <span className="block text-sm font-semibold">{c.label}</span>
                              <span className="block text-xs opacity-60">{c.desc}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={closeAll}
                    className="rounded-full px-4 py-2 text-sm font-medium text-[#FBF6E6]/80 transition-colors hover:bg-[#FFD21F] hover:text-[#14110a]"
                  >
                    {n.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href={ADMIN_LOGIN_HREF}
              prefetch={false}
              className="hidden items-center gap-2 rounded-full border-2 border-[#FFD21F] px-5 py-2 text-sm font-bold text-[#FFD21F] transition-colors hover:bg-[#FFD21F] hover:text-[#14110a] lg:inline-flex"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="11" width="16" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Login Admin
            </Link>

            <button
              aria-label="Buka menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#FFD21F]/50 lg:hidden"
            >
              <span className="space-y-1.5">
                <span className={`block h-0.5 w-5 bg-[#FFD21F] transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 bg-[#FFD21F] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-[#FFD21F] transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </nav>

        {/* mobile */}
        {menuOpen && (
          <ul className="mx-5 mt-3 max-h-[calc(100vh-6rem)] space-y-1 overflow-y-auto rounded-3xl border border-[#FFD21F]/30 bg-[#14110a] p-3 lg:hidden">
            {NAV.map((n) =>
              "children" in n ? (
                <li key={n.label}>
                  <button
                    type="button"
                    aria-expanded={mobSub === n.label}
                    onClick={() => setMobSub(mobSub === n.label ? null : n.label)}
                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium hover:bg-[#FFD21F]/10"
                  >
                    {n.label}
                    <Chevron open={mobSub === n.label} />
                  </button>
                  {mobSub === n.label && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-[#FFD21F]/30 pl-3">
                      {n.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={closeAll}
                            className="block rounded-2xl px-4 py-2.5 text-sm text-[#FBF6E6]/80 hover:bg-[#FFD21F] hover:text-[#14110a]"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={closeAll}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-[#FFD21F] hover:text-[#14110a]"
                  >
                    {n.label}
                  </Link>
                </li>
              )
            )}
            <li className="pt-2">
              <Link
                href={ADMIN_LOGIN_HREF}
                prefetch={false}
                onClick={closeAll}
                className="block rounded-2xl bg-[#FFD21F] px-4 py-3 text-center text-sm font-bold text-[#14110a]"
              >
                🔒 Login Admin
              </Link>
            </li>
          </ul>
        )}
      </header>
    </>
  );
}