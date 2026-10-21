
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TAB_FLAG } from "@/lib/admin-tab";

type IconName =
  | "home"
  | "news"
  | "pen"
  | "image"
  | "drive"
  | "structure"
  | "globe"
  | "logout"
  | "close";

const ICONS: Record<IconName, string[]> = {
  home: ["M3 11l9-8 9 8", "M5 10v10h5v-6h4v6h5V10"],
  news: [
    "M4 5h13a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V5Z",
    "M19 9h1a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2",
    "M8 9h7M8 13h7M8 16h4",
  ],
  pen: [
    "M4 20l4-1 11-11a2.1 2.1 0 0 0-3-3L5 16l-1 4Z",
    "M14 7l3 3",
  ],
  image: [
    "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
    "M3 16l5-5 4 4 3-3 6 6",
    "M9 9.5h.01",
  ],
  drive: [
    "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
    "M3 11h18",
  ],
  structure: [
    "M12 3v5",
    "M6 8h12",
    "M6 8v5",
    "M18 8v5",
    "M3 13h6v6H3z",
    "M15 13h6v6h-6z",
  ],
  globe: [
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
    "M3 12h18",
    "M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z",
  ],
  logout: [
    "M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5",
    "M16 8l4 4-4 4",
    "M20 12H9",
  ],
  close: ["M18 6 6 18", "m6 6 12 12"],
};

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function MovingText({
  text,
  className = "",
  title,
}: {
  text: string;
  className?: string;
  title?: string;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(8);

  useEffect(() => {
    const container = containerRef.current;
    const content = textRef.current;

    if (!container || !content) return;

    const measure = () => {
      const excess = content.scrollWidth - container.clientWidth;

      setOverflow(excess > 2);
      setDistance(Math.max(0, excess));
      setDuration(Math.max(5, excess / 12));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(content);

    return () => observer.disconnect();
  }, [text]);

  return (
    <span
      ref={containerRef}
      title={title ?? text}
      className={`block min-w-0 overflow-hidden ${className}`}
    >
      <span
        ref={textRef}
        className={`block w-max max-w-none whitespace-nowrap ${
          overflow
            ? "motion-safe:animate-account-marquee"
            : "truncate"
        }`}
        style={
          overflow
            ? ({
                "--marquee-distance": `-${distance}px`,
                "--marquee-duration": `${duration}s`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {text}
      </span>
    </span>
  );
}

const MENU: {
  href: string;
  label: string;
  icon: IconName;
}[] = [
  { href: "/admin", label: "Dashboard", icon: "home" },
  { href: "/admin/berita", label: "Berita", icon: "news" },
  { href: "/admin/karya", label: "Karya Tulis", icon: "pen" },
  { href: "/admin/galeri", label: "Galeri", icon: "image" },
  { href: "/admin/drive", label: "IKSAJ Drive", icon: "drive" },
  { href: "/admin/struktur", label: "Struktur", icon: "structure" },
];

function SidebarBody({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (mounted) {
        setEmail(data.user?.email ?? null);
      }
    }

    void loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setLoggingOut(false);
        return;
      }

      try {
        sessionStorage.removeItem(TAB_FLAG);
      } catch {
        // sessionStorage mungkin tidak tersedia.
      }

      router.replace("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  const username = email ? email.split("@")[0] : "admin";

  return (
    <div className="flex h-full min-h-0 flex-col text-[#FBF6E6]">
      {/* BRAND */}
      <Link
        href="/admin"
        onClick={onNavigate}
        className="group flex shrink-0 items-center gap-3 px-5 pb-6 pt-6"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#FFD21F]/20 bg-[#FFD21F]/[0.06] p-1 transition-colors group-hover:border-[#FFD21F]/50">
          <Image
            src="/logo.png"
            alt="Logo IKSAJ"
            width={40}
            height={40}
            priority
            className="h-full w-full object-contain"
          />
        </span>

        <span className="min-w-0">
          <span className="block font-[family-name:var(--font-display)] text-xl font-black leading-none tracking-tight">
            IKSAJ
          </span>
          <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD21F]">
            Panel Admin
          </span>
        </span>
      </Link>

      <div className="mx-5 h-px shrink-0 bg-[#FFD21F]/10" />

      {/* NAVIGASI */}
      <nav
        aria-label="Menu admin"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5"
      >
        <p className="px-3 pb-3 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#FBF6E6]/35">
          Menu Utama
        </p>

        <ul className="space-y-1.5">
          {MENU.map((item) => {
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex min-h-11 items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "bg-[#FFD21F] text-[#14110a]"
                      : "text-[#FBF6E6]/65 hover:bg-[#FFD21F]/[0.08] hover:text-[#FFD21F]"
                  }`}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#14110a]/70"
                    />
                  )}

                  <Icon
                    name={item.icon}
                    className={`h-[19px] w-[19px] ${
                      active
                        ? "text-[#14110a]"
                        : "text-[#FBF6E6]/50 transition-colors group-hover:text-[#FFD21F]"
                    }`}
                  />

                  <span className="flex-1">{item.label}</span>

                  {active && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#14110a]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="px-3 pb-3 pt-7 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#FBF6E6]/35">
          Lainnya
        </p>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="group flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#FBF6E6]/65 transition-colors hover:bg-[#FFD21F]/[0.08] hover:text-[#FFD21F]"
        >
          <Icon
            name="globe"
            className="h-[19px] w-[19px] text-[#FBF6E6]/50 transition-colors group-hover:text-[#FFD21F]"
          />

          <span className="flex-1">Lihat Situs</span>

          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 opacity-50"
          >
            <path d="M14 3h7v7" />
            <path d="M10 14 21 3" />
            <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
          </svg>
        </Link>
      </nav>

      {/* AKUN DAN IKON KELUAR */}
      <div className="shrink-0 border-t border-[#FFD21F]/15 p-3 sm:p-4">
        <div className="flex min-w-0 items-center gap-2 rounded-xl px-1 py-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFD21F] font-[family-name:var(--font-display)] text-base font-black uppercase text-[#14110a]">
            {username.charAt(0)}
          </span>

          <div className="min-w-0 flex-1">
            <MovingText
              text={username}
              className="text-sm font-bold text-[#FBF6E6]"
            />

            <MovingText
              text={email ?? "Memuat akun..."}
              className="mt-1 text-[11px] text-[#FBF6E6]/45"
            />
          </div>

          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            aria-label={
              loggingOut
                ? "Sedang keluar dari akun"
                : "Keluar dari akun"
            }
            title={loggingOut ? "Sedang keluar..." : "Keluar dari akun"}
            className="group grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#FFD21F]/25 text-[#FFD21F] transition-colors hover:border-[#FFD21F] hover:bg-[#FFD21F] hover:text-[#14110a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14110a] disabled:cursor-wait disabled:opacity-50"
          >
            {loggingOut ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-[18px] w-[18px] animate-spin"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeOpacity=".25"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <Icon
                name="logout"
                className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#FFD21F]/15 bg-[#14110a] lg:block">
        <SidebarBody />
      </aside>

      {/* HEADER MOBILE */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-[#FFD21F]/15 bg-[#14110a] px-4 sm:px-6 lg:hidden">
        <Link
          href="/admin"
          aria-label="IKSAJ Dashboard"
          className="flex items-center gap-2.5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#FFD21F]/15 bg-[#FFD21F]/[0.05] p-1">
            <Image
              src="/logo.png"
              alt="Logo IKSAJ"
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </span>

          <span>
            <span className="block font-[family-name:var(--font-display)] text-base font-black leading-none tracking-tight text-[#FBF6E6]">
              IKSAJ
            </span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFD21F]">
              Panel Admin
            </span>
          </span>
        </Link>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-admin-sidebar"
          onClick={() => setOpen((previous) => !previous)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#FFD21F]/30 text-[#FFD21F] transition-colors hover:bg-[#FFD21F] hover:text-[#14110a]"
        >
          {open ? (
            <Icon name="close" className="h-5 w-5" />
          ) : (
            <span className="flex flex-col gap-[5px]" aria-hidden="true">
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
            </span>
          )}
        </button>
      </header>

      {/* DRAWER MOBILE */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <aside
            id="mobile-admin-sidebar"
            aria-label="Navigasi admin mobile"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[88%] flex-col border-r border-[#FFD21F]/20 bg-[#14110a] shadow-[12px_0_40px_rgba(0,0,0,0.35)]"
          >
            <div className="flex min-h-0 flex-1 flex-col">
              <SidebarBody onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
