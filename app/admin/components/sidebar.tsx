"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TAB_FLAG } from "@/lib/admin-tab";

type IconName = "home" | "news" | "pen" | "image" | "drive" | "globe" | "logout";

const ICONS: Record<IconName, string[]> = {
  home: ["M3 11l9-8 9 8", "M5 10v10h5v-6h4v6h5V10"],
  news: [
    "M4 5h13a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V5Z",
    "M19 9h1a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2",
    "M8 9h7M8 13h7M8 16h4",
  ],
  pen: ["M4 20l4-1 11-11a2.1 2.1 0 0 0-3-3L5 16l-1 4Z", "M14 7l3 3"],
  image: [
    "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
    "M3 16l5-5 4 4 3-3 6 6",
    "M9 9.5h.01",
  ],
  drive: [
    "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
    "M3 11h18",
  ],
  globe: [
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
    "M3 12h18",
    "M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z",
  ],
  logout: ["M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5", "M16 8l4 4-4 4", "M20 12H9"],
};

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

const MENU: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Dashboard", icon: "home" },
  { href: "/admin/berita", label: "Berita", icon: "news" },
  { href: "/admin/karya", label: "Karya Tulis", icon: "pen" },
  { href: "/admin/galeri", label: "Galeri", icon: "image" },
  { href: "/admin/drive", label: "IKSAJ Drive", icon: "drive" },
];

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    try {
      sessionStorage.removeItem(TAB_FLAG);
    } catch {}
    router.replace("/admin/login");
    router.refresh();
  }

  const username = email ? email.split("@")[0] : "admin";

  return (
    <div className="flex h-full flex-col">
      {/* brand */}
      <Link
        href="/admin"
        onClick={onNavigate}
        className="flex items-center gap-3 px-5 pb-6 pt-6"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FBF6E6] p-1">
          <Image
            src="/logo.png"
            alt="Logo IKSAJ"
            width={40}
            height={40}
            className="h-full w-full object-contain"
          />
        </span>
        <span>
          <span className="block font-[family-name:var(--font-display)] text-lg font-extrabold leading-none tracking-tight">
            IKSAJ
          </span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#FFD21F]">
            Panel Admin
          </span>
        </span>
      </Link>

      {/* menu */}
      <nav aria-label="Menu admin" className="flex-1 overflow-y-auto px-3">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#FBF6E6]/40">
          Menu
        </p>
        <ul className="space-y-1">
          {MENU.map((m) => {
            const active = isActive(m.href);
            return (
              <li key={m.href}>
                <Link
                  href={m.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-[#FFD21F] text-[#14110a]"
                      : "text-[#FBF6E6]/75 hover:bg-[#FFD21F]/10 hover:text-[#FFD21F]"
                  }`}
                >
                  <Icon name={m.icon} />
                  {m.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="px-3 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#FBF6E6]/40">
          Lainnya
        </p>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#FBF6E6]/75 transition-colors hover:bg-[#FFD21F]/10 hover:text-[#FFD21F]"
        >
          <Icon name="globe" />
          Lihat situs
        </Link>
      </nav>

      {/* akun + keluar */}
      <div className="border-t border-[#FFD21F]/15 p-3">
        <div className="flex items-center gap-3 rounded-2xl px-3 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#FFD21F] text-sm font-extrabold uppercase text-[#14110a]">
            {username.charAt(0)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{username}</span>
            <span className="block truncate text-xs text-[#FBF6E6]/50">
              {email ?? "Memuat..."}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-[#FFD21F]/40 px-4 py-2.5 text-sm font-bold text-[#FFD21F] transition-colors hover:bg-[#FFD21F] hover:text-[#14110a] disabled:opacity-60"
        >
          <Icon name="logout" />
          {loggingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  // tutup drawer dengan Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* sidebar tetap (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#FFD21F]/15 bg-[#14110a] lg:block">
        <SidebarBody />
      </aside>

      {/* bilah atas (mobile) */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#FFD21F]/15 bg-[#14110a] px-4 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#FBF6E6] p-0.5">
            <Image
              src="/logo.png"
              alt="Logo IKSAJ"
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-[family-name:var(--font-display)] text-base font-extrabold tracking-tight">
            IKSAJ
          </span>
        </Link>
        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-full border border-[#FFD21F]/50"
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-[#FFD21F]" />
            <span className="block h-0.5 w-5 bg-[#FFD21F]" />
            <span className="block h-0.5 w-5 bg-[#FFD21F]" />
          </span>
        </button>
      </div>

      {/* drawer (mobile) */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-[#FFD21F]/20 bg-[#14110a]">
            <SidebarBody onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}