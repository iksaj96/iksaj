
"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./ui";

type NavChild = {
  href: string;
  label: string;
  desc: string;
  icon: string;
};

type NavItem =
  | {
      label: string;
      href: string;
      icon: string;
    }
  | {
      label: string;
      children: NavChild[];
      icon: string;
    };

const NAV: NavItem[] = [
  {
    label: "Beranda",
    href: "/",
    icon: "home",
  },
  {
    label: "Tentang",
    icon: "users",
    children: [
      {
        href: "/tentang",
        label: "Tentang Kami",
        desc: "Mengenal IKSAJ",
        icon: "info",
      },
      {
        href: "/sejarah",
        label: "Sejarah",
        desc: "Perjalanan sejak 1996",
        icon: "history",
      },
      {
        href: "/visi-misi",
        label: "Visi & Misi",
        desc: "Arah langkah organisasi",
        icon: "target",
      },
      {
        href: "/struktur",
        label: "Struktur",
        desc: "Susunan pengurus",
        icon: "users",
      },
    ],
  },
  {
    label: "Publikasi",
    icon: "book",
    children: [
      {
        href: "/berita",
        label: "Berita",
        desc: "Kabar terbaru IKSAJ",
        icon: "newspaper",
      },
      {
        href: "/karya",
        label: "Karya Tulis",
        desc: "Tulisan anggota",
        icon: "pen",
      },
      {
        href: "/galeri",
        label: "Galeri",
        desc: "Dokumentasi kegiatan",
        icon: "images",
      },
    ],
  },
];

const ADMIN_LOGIN_HREF = "/admin/login";

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-7h6v7" />
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
    chevron: <path d="m9 18 6-6-6-6" />,
    close: (
      <>
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </>
    ),
    arrow: (
      <>
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] ?? paths.info}
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 8 5 5 5-5" />
    </svg>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const sheetRef = useRef<HTMLElement>(null);

  const closeAll = () => {
    setDrop(null);
    setSheetOpen(null);
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting);
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (navRef.current && !navRef.current.contains(target)) {
        setDrop(null);
      }

      // Jangan menutup sheet saat pengguna menekan navigasi bawah.
      const bottomNav = document.querySelector(
        '[aria-label="Navigasi utama mobile"]'
      );

      if (
        sheetRef.current &&
        !sheetRef.current.contains(target) &&
        !bottomNav?.contains(target)
      ) {
        setSheetOpen(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAll();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    setSheetOpen(null);
    setDrop(null);
  }, [pathname]);

  // Kunci scroll halaman saat bottom sheet terbuka.
  useEffect(() => {
    if (!sheetOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sheetOpen]);

  const activeSheet = NAV.find(
    (item) => "children" in item && item.label === sheetOpen
  );

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="absolute left-0 top-0 h-6 w-full"
      />

      {/* HEADER DAN NAVIGASI DESKTOP */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[padding,background-color,border-color] duration-300 ${
          scrolled
            ? "border-b border-[#FFD21F]/20 bg-[#14110a] py-3"
            : "border-b border-transparent bg-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5">
          <Link
            href="/"
            onClick={closeAll}
            className="flex shrink-0 items-center gap-2.5"
          >
            <Logo size={40} className="bg-transparent" />
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              IKSAJ
            </span>
          </Link>

          <ul
            ref={navRef}
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV.map((item) =>
              "children" in item ? (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDrop(item.label)}
                  onMouseLeave={() => setDrop(null)}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={drop === item.label}
                    onClick={() =>
                      setDrop(drop === item.label ? null : item.label)
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-[#FFD21F] hover:text-[#14110a] ${
                      drop === item.label ||
                      item.children.some((child) =>
                        isActivePath(pathname, child.href)
                      )
                        ? "bg-[#FFD21F] text-[#14110a]"
                        : "text-[#FBF6E6]/80"
                    }`}
                  >
                    {item.label}
                    <Chevron open={drop === item.label} />
                  </button>

                  {drop === item.label && (
                    <div className="absolute left-0 top-full z-50 w-64 pt-2">
                      <ul
                        role="menu"
                        className="rounded-2xl border border-[#FFD21F]/30 bg-[#14110a] p-2 shadow-[6px_6px_0_0_#FFD21F]"
                      >
                        {item.children.map((child) => (
                          <li key={child.href} role="none">
                            <Link
                              role="menuitem"
                              href={child.href}
                              onClick={closeAll}
                              className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#FFD21F] hover:text-[#14110a] ${
                                isActivePath(pathname, child.href)
                                  ? "bg-[#FFD21F]/10 text-[#FFD21F]"
                                  : ""
                              }`}
                            >
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-current/15">
                                <Icon name={child.icon} />
                              </span>
                              <span>
                                <span className="block text-sm font-semibold">
                                  {child.label}
                                </span>
                                <span className="block text-xs opacity-60">
                                  {child.desc}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeAll}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-[#FFD21F] hover:text-[#14110a] ${
                      isActivePath(pathname, item.href)
                        ? "bg-[#FFD21F] text-[#14110a]"
                        : "text-[#FBF6E6]/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <Link
            href={ADMIN_LOGIN_HREF}
            prefetch={false}
            className="hidden items-center gap-2 rounded-full border-2 border-[#FFD21F] px-5 py-2 text-sm font-bold text-[#FFD21F] transition-colors hover:bg-[#FFD21F] hover:text-[#14110a] lg:inline-flex"
          >
            <Icon name="lock" className="h-4 w-4" />
            Login Admin
          </Link>

          <span className="text-xs font-semibold tracking-wider text-[#FBF6E6]/50 lg:hidden">
            ANNUQAYAH
          </span>
        </nav>
      </header>

      {/* FLOATING BOTTOM NAVIGATION MOBILE */}
      <nav
        aria-label="Navigasi utama mobile"
        className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden"
      >
        <div className="mx-auto flex max-w-md items-stretch justify-around gap-1 rounded-[26px] border border-[#FFD21F]/25 bg-[#14110a] p-2 shadow-[0_12px_45px_rgba(0,0,0,0.45)]">
          {NAV.map((item) => {
            const hasChildren = "children" in item;

            const active = hasChildren
              ? item.children.some((child) =>
                  isActivePath(pathname, child.href)
                )
              : isActivePath(pathname, item.href);

            const selected = hasChildren && sheetOpen === item.label;

            const content = (
              <>
                <span
                  className={`grid h-8 w-10 place-items-center rounded-2xl transition-colors ${
                    active || selected
                      ? "bg-[#FFD21F] text-[#14110a]"
                      : "text-[#FBF6E6]/65"
                  }`}
                >
                  <Icon name={item.icon} className="h-[21px] w-[21px]" />
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    active || selected
                      ? "text-[#FFD21F]"
                      : "text-[#FBF6E6]/65"
                  }`}
                >
                  {item.label}
                </span>
              </>
            );

            return (
              <div key={item.label} className="min-w-0 flex-1">
                {hasChildren ? (
                  <button
                    type="button"
                    aria-label={`Buka menu ${item.label}`}
                    aria-expanded={selected}
                    onClick={() =>
                      setSheetOpen(selected ? null : item.label)
                    }
                    className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl py-1.5 transition-colors"
                  >
                    {content}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeAll}
                    aria-current={active ? "page" : undefined}
                    className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl py-1.5"
                  >
                    {content}
                  </Link>
                )}
              </div>
            );
          })}

          <Link
            href={ADMIN_LOGIN_HREF}
            prefetch={false}
            onClick={closeAll}
            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1.5"
          >
            <span
              className={`grid h-8 w-10 place-items-center rounded-2xl ${
                pathname.startsWith("/admin")
                  ? "bg-[#FFD21F] text-[#14110a]"
                  : "text-[#FBF6E6]/65"
              }`}
            >
              <Icon name="lock" className="h-[21px] w-[21px]" />
            </span>
            <span
              className={`text-[10px] font-semibold ${
                pathname.startsWith("/admin")
                  ? "text-[#FFD21F]"
                  : "text-[#FBF6E6]/65"
              }`}
            >
              Admin
            </span>
          </Link>
        </div>
      </nav>

      {/* BACKDROP BOTTOM SHEET: TANPA BLUR */}
      <div
        aria-hidden={!sheetOpen}
        onClick={() => setSheetOpen(null)}
        className={`fixed inset-0 z-[60] bg-black/65 transition-opacity duration-300 lg:hidden ${
          sheetOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* BOTTOM SHEET DROPDOWN */}
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal={sheetOpen ? "true" : undefined}
        aria-label={sheetOpen ? `Menu ${sheetOpen}` : "Menu navigasi"}
        aria-hidden={!sheetOpen}
        className={`fixed inset-x-0 bottom-0 z-[70] max-h-[82dvh] overflow-y-auto rounded-t-[30px] border border-b-0 border-[#FFD21F]/25 bg-[#14110a] pb-[max(20px,env(safe-area-inset-bottom))] shadow-[0_-20px_70px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out lg:hidden ${
          sheetOpen
            ? "translate-y-0"
            : "pointer-events-none translate-y-full"
        }`}
      >
        <div className="mx-auto w-full max-w-xl px-5 pb-4 pt-3">
          <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#FBF6E6]/20" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFD21F]">
                Navigasi IKSAJ
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold">
                {sheetOpen ?? "Jelajahi"}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSheetOpen(null)}
              aria-label="Tutup menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#FBF6E6]/15 text-[#FBF6E6]/70 transition-colors hover:border-[#FFD21F] hover:bg-[#FFD21F] hover:text-[#14110a]"
            >
              <Icon name="close" />
            </button>
          </div>

          <p className="mt-2 text-sm text-[#FBF6E6]/50">
            Pilih halaman yang ingin kamu kunjungi.
          </p>

          <div className="mt-6 space-y-2">
            {activeSheet &&
              "children" in activeSheet &&
              activeSheet.children.map((child) => {
                const active = isActivePath(pathname, child.href);

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={closeAll}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-4 rounded-2xl border p-3.5 transition-colors ${
                      active
                        ? "border-[#FFD21F]/40 bg-[#FFD21F]/[0.09]"
                        : "border-[#FBF6E6]/[0.07] bg-[#FBF6E6]/[0.025] hover:border-[#FFD21F]/35 hover:bg-[#FFD21F]/[0.06]"
                    }`}
                  >
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-colors ${
                        active
                          ? "bg-[#FFD21F] text-[#14110a]"
                          : "bg-[#FBF6E6]/[0.06] text-[#FFD21F] group-hover:bg-[#FFD21F] group-hover:text-[#14110a]"
                      }`}
                    >
                      <Icon name={child.icon} className="h-6 w-6" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-bold ${
                          active ? "text-[#FFD21F]" : "text-[#FBF6E6]"
                        }`}
                      >
                        {child.label}
                      </span>
                      <span className="mt-1 block text-xs text-[#FBF6E6]/45">
                        {child.desc}
                      </span>
                    </span>

                    <Icon
                      name="chevron"
                      className={`h-5 w-5 shrink-0 ${
                        active
                          ? "text-[#FFD21F]"
                          : "text-[#FBF6E6]/30"
                      }`}
                    />
                  </Link>
                );
              })}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#FFD21F]/15 bg-[#FFD21F]/[0.04] p-4">
            <Logo size={42} className="shrink-0 bg-transparent" />
            <div>
              <p className="text-sm font-bold">IKSAJ</p>
              <p className="mt-1 text-xs leading-relaxed text-[#FBF6E6]/50">
                Ikatan Santri Annuqayah Jawa
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
