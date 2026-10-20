"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { createClient } from "@/lib/supabase/client";
import { TAB_FLAG } from "@/lib/admin-tab";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});
const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const EMAIL_DOMAIN = "@iksaj.com";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  // fokus ke username; lalu putuskan: lanjut ke dashboard atau hanguskan sesi sisa
  useEffect(() => {
    userRef.current?.focus();

    let cancelled = false;
    (async () => {
      let flag: string | null = null;
      try {
        flag = sessionStorage.getItem(TAB_FLAG);
      } catch {}

      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (cancelled || !data.user) return;

      if (flag) {
        // tab ini memang sedang login → langsung ke dashboard
        router.replace("/admin");
      } else {
        // cookie sisa dari tab lama → hanguskan
        await Promise.race([
          supabase.auth.signOut({ scope: "local" }),
          new Promise((r) => setTimeout(r, 1500)),
        ]).catch(() => {});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // jika pengguna mengetik "@" sendiri, anggap itu email lengkap
  const hasAt = username.includes("@");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);

    const name = username.trim().toLowerCase();
    if (!name || !password) {
      setError("Username dan kata sandi wajib diisi.");
      return;
    }
    const email = name.includes("@") ? name : `${name}${EMAIL_DOMAIN}`;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Username atau kata sandi salah.");
      setLoading(false);
      passRef.current?.focus();
      return;
    }

    try {
      sessionStorage.setItem(TAB_FLAG, "1");
    } catch {}
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main
      className={`${display.variable} ${body.variable} relative grid min-h-screen overflow-hidden bg-[#14110a] font-[family-name:var(--font-body)] text-[#FBF6E6] selection:bg-[#FFD21F] selection:text-[#14110a] lg:grid-cols-2`}
    >
      <style>{`
        @keyframes spin360 { to { transform: rotate(360deg); } }
        @keyframes spin360r { to { transform: rotate(-360deg); } }
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .ring-a { animation: spin360 60s linear infinite; will-change: transform; }
        .ring-b { animation: spin360r 90s linear infinite; will-change: transform; }
        .floaty { animation: floaty 7s ease-in-out infinite; will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .ring-a, .ring-b, .floaty { animation: none; }
        }
      `}</style>

      {/* HEADER POJOK KIRI ATAS: tombol kembali (ikon) + logo + brand */}
      <header className="absolute left-5 top-5 z-20 flex items-center gap-3 md:left-8 md:top-7">
        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="grid h-10 w-10 place-items-center rounded-full border border-[#FFD21F]/50 text-[#FFD21F] transition-colors hover:bg-[#FFD21F] hover:text-[#14110a]"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>

        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FBF6E6] p-1">
            <Image
              src="/logo.png"
              alt="Logo IKSAJ"
              width={40}
              height={40}
              priority
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            IKSAJ
          </span>
        </Link>
      </header>

      {/* SISI KIRI: logo besar + tagline (disusun kolom agar tidak bertumpuk) */}
      <section
        aria-hidden
        className="relative hidden flex-col overflow-hidden lg:flex"
      >
        {/* cahaya latar */}
        <div className="pointer-events-none absolute -left-40 top-1/2 h-[760px] w-[760px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,210,31,0.18)_0%,rgba(255,210,31,0)_65%)]" />

        {/* area logo: mengisi ruang tengah */}
        <div className="relative flex flex-1 items-center justify-center pt-24">
          {/* cincin dekoratif */}
          <svg
            viewBox="0 0 600 600"
            className="ring-a pointer-events-none absolute left-1/2 top-1/2 h-[min(44vw,78vh)] w-[min(44vw,78vh)] -translate-x-1/2 -translate-y-1/2"
          >
            <circle
              cx="300"
              cy="300"
              r="290"
              fill="none"
              stroke="#FFD21F"
              strokeOpacity="0.3"
              strokeWidth="1.5"
              strokeDasharray="4 14"
            />
          </svg>
          <svg
            viewBox="0 0 600 600"
            className="ring-b pointer-events-none absolute left-1/2 top-1/2 h-[min(36vw,64vh)] w-[min(36vw,64vh)] -translate-x-1/2 -translate-y-1/2"
          >
            <circle
              cx="300"
              cy="300"
              r="290"
              fill="none"
              stroke="#FFB000"
              strokeOpacity="0.45"
              strokeWidth="2"
              strokeDasharray="90 30"
            />
          </svg>

          {/* logo: lapisan krem berujung lembut agar melebur ke latar gelap */}
          <div className="floaty relative grid aspect-square w-[min(26vw,40vh)] place-items-center">
            <div
              className="absolute inset-[-18%] bg-[#FBF6E6]"
              style={{
                WebkitMaskImage:
                  "radial-gradient(circle, #000 0%, #000 48%, transparent 68%)",
                maskImage:
                  "radial-gradient(circle, #000 0%, #000 48%, transparent 68%)",
              }}
            />
            <Image
              src="/logo.png"
              alt=""
              width={700}
              height={700}
              priority
              className="relative h-[78%] w-[78%] object-contain"
            />
          </div>
        </div>

        {/* tagline: berada di bawah area logo, tidak menimpa cahaya krem */}
        <div className="relative z-10 px-10 pb-12 pt-6">
          <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
            Berawal dari{" "}
            <span className="bg-[linear-gradient(transparent_62%,#FFD21F_62%)] px-1 text-[#FBF6E6]">
              persaudaraan
            </span>
            ,
            <br />
            tumbuh dalam perjuangan.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFD21F]">
            Sejak 6 Agustus 1996
          </p>
        </div>

        {/* pudar ke sisi form agar tidak ada garis pemisah keras */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-r from-transparent to-[#14110a]" />
      </section>

      {/* logo samar untuk layar kecil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 opacity-[0.07] lg:hidden"
      >
        <Image
          src="/logo.png"
          alt=""
          width={420}
          height={420}
          className="h-full w-full object-contain"
        />
      </div>

      {/* SISI KANAN: form login */}
      <section className="relative z-10 flex items-center justify-center px-5 pb-12 pt-28 lg:px-12 lg:pt-12">
        <div className="w-full max-w-sm">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#FFD21F]/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#FFD21F]">
            <span className="h-2 w-2 rounded-full bg-[#FFD21F]" />
            Panel Admin
          </p>

          <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
            Selamat
            <br />
            <span className="text-[#FFD21F]">datang.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#FBF6E6]/60">
            Masuk untuk mengelola berita, karya tulis, dan galeri IKSAJ.
          </p>

          <form onSubmit={onSubmit} className="mt-8">
            <label className="block text-sm font-semibold" htmlFor="username">
              Username
            </label>
            <div className="mt-1.5 flex items-center rounded-2xl border-2 border-[#FBF6E6]/20 bg-[#FBF6E6]/5 transition-colors focus-within:border-[#FFD21F]">
              <input
                ref={userRef}
                id="username"
                name="username"
                type="text"
                required
                autoFocus
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  // Enter di username → pindah ke kata sandi
                  if (e.key === "Enter" && username.trim()) {
                    e.preventDefault();
                    passRef.current?.focus();
                  }
                }}
                placeholder="username"
                className="min-w-0 flex-1 bg-transparent py-3 pl-4 pr-1 text-[#FBF6E6] outline-none placeholder:text-[#FBF6E6]/30"
              />
              {!hasAt && (
                <span className="select-none pr-4 text-sm font-medium text-[#FBF6E6]/50">
                  {EMAIL_DOMAIN}
                </span>
              )}
            </div>

            <label
              className="mt-5 block text-sm font-semibold"
              htmlFor="password"
            >
              Kata sandi
            </label>
            <div className="relative mt-1.5">
              <input
                ref={passRef}
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border-2 border-[#FBF6E6]/20 bg-[#FBF6E6]/5 py-3 pl-4 pr-12 text-[#FBF6E6] outline-none transition-colors placeholder:text-[#FBF6E6]/30 focus:border-[#FFD21F]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={
                  showPw ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                }
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-[#FBF6E6]/60 transition-colors hover:text-[#FFD21F]"
              >
                {showPw ? (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.2 9.5 6-.4.8-1.3 2-2.5 3.1M6.6 7.6C4.6 9 3.3 10.9 2.5 12c1 1.8 4.5 6 9.5 6 1.5 0 2.8-.4 4-1" />
                    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                  </svg>
                ) : (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.5 12C3.5 10.2 7 6 12 6s8.5 4.2 9.5 6c-1 1.8-4.5 6-9.5 6s-8.5-4.2-9.5-6Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-2.5 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#FFD21F] px-6 py-3.5 font-bold text-[#14110a] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
              {!loading && (
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>
          </form>

          <p className="mt-5 text-xs text-[#FBF6E6]/40">
            Sesi berakhir otomatis saat tab ditutup.
          </p>
        </div>
      </section>
    </main>
  );
}