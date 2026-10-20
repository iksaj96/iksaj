"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});
const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

/* ---------- DATA ---------- */

type NavChild = { id: string; label: string; desc: string };
type NavItem =
  | { label: string; id: string }
  | { label: string; children: NavChild[] };

const NAV: NavItem[] = [
  {
    label: "Tentang",
    children: [
      { id: "tentang", label: "Tentang Kami", desc: "Mengenal IKSAJ" },
      { id: "sejarah", label: "Sejarah", desc: "Perjalanan sejak 1996" },
      { id: "visi", label: "Visi & Misi", desc: "Arah langkah organisasi" },
      { id: "struktur", label: "Struktur", desc: "Susunan pengurus" },
    ],
  },
  { label: "Kegiatan", id: "kegiatan" },
  {
    label: "Publikasi",
    children: [
      { id: "berita", label: "Berita", desc: "Kabar terbaru IKSAJ" },
      { id: "karya", label: "Karya Tulis", desc: "Tulisan anggota" },
      { id: "galeri", label: "Galeri", desc: "Dokumentasi kegiatan" },
    ],
  },
  { label: "Kontak", id: "kontak" },
];

const ADMIN_LOGIN_HREF = "/admin/login";

const DAERAH = [
  "Jember",
  "Bondowoso",
  "Situbondo",
  "Banyuwangi",
  "Lubangsa",
  "Guluk-Guluk",
  "Sumenep",
  "Annuqayah",
];

const TIMELINE = [
  {
    tahun: "Pra-1996",
    judul: "Masa Perkumpulan Pendahulu",
    isi: "Santri asal Jawa pernah berhimpun dalam SANTIKA (Santri Tiga Kabupaten) yang menghimpun santri Jember, Banyuwangi, dan Situbondo. Perkumpulan berikutnya dikenal dengan nama AKBAR 88.",
  },
  {
    tahun: "± 2 Tahun",
    judul: "Masa Jeda",
    isi: "Santri Jawa sempat tidak memiliki wadah perkumpulan selama kurang lebih dua tahun, hingga muncul keinginan untuk membangunnya kembali.",
  },
  {
    tahun: "6 Agt 1996",
    judul: "Lahirnya IKSAJ",
    isi: "Atas inisiatif Moh. Holil Syarqawi, santri asal Jember, Bondowoso, Situbondo, dan sekitarnya bermusyawarah dan menyepakati terbentuknya Ikatan Santri Annuqayah Jawa (IKSAJ).",
  },
  {
    tahun: "2021",
    judul: "Penguatan Organisasi",
    isi: "Pelantikan pengurus periode 2021–2022 yang menekankan konsolidasi, komunikasi, dan kekompakan. Pada Mei 2021 digelar Ngaji Organisasi di Ledokombo, Jember.",
  },
  {
    tahun: "2022",
    judul: "Harlah ke-26",
    isi: "Pada 5–6 Agustus 2022, hari lahir diperingati dengan penampilan Sanggar Pelangi dan diskusi podcast bersama sejumlah tokoh organisasi.",
  },
  {
    tahun: "2023",
    judul: "Bakti Sosial",
    isi: "Penyaluran 24 paket sembako kepada kaum duafa pada April 2023 sebagai wujud kepedulian terhadap masyarakat.",
  },
];

const MISI = [
  "Meningkatkan keimanan dan ketakwaan kepada Allah SWT.",
  "Menerapkan nilai-nilai Islam dalam kehidupan pribadi dan masyarakat.",
  "Mengembangkan potensi organisasi.",
  "Memperkuat persaudaraan, kasih sayang, persatuan, dan kesatuan anggota.",
  "Mendorong pendidikan sebagai sarana pembentukan kepribadian muslim.",
  "Menyelenggarakan kegiatan dalam berbagai bidang sesuai tujuan organisasi.",
];

const KEGIATAN = [
  {
    judul: "Harlah IKSAJ",
    ket: "Peringatan hari lahir organisasi dengan seni dan diskusi sejarah, untuk menanamkan pemahaman keorganisasian kepada anggota.",
    label: "Tradisi Tahunan",
    rot: "-rotate-2",
    bg: "bg-[#FFD21F] text-[#14110a]",
  },
  {
    judul: "Safari Ramadan & Ngaji Organisasi",
    ket: "Dialog bersama mantan ketua tentang loyalitas, profesionalitas, dan pengalaman berorganisasi di tengah masyarakat.",
    label: "Dakwah & Kaderisasi",
    rot: "rotate-1",
    bg: "bg-[#14110a] text-[#FBF6E6]",
  },
  {
    judul: "Bakti Sosial",
    ket: "Kepedulian nyata kepada sesama melalui penyaluran paket sembako kepada kaum duafa.",
    label: "Sosial",
    rot: "-rotate-1",
    bg: "bg-white text-[#14110a]",
  },
  {
    judul: "Sanggar Pelangi",
    ket: "Wadah seni dan kreativitas santri, mulai dari pentas mini hingga penampilan dalam peringatan hari lahir.",
    label: "Seni & Kreativitas",
    rot: "rotate-2",
    bg: "bg-[#FFB000] text-[#14110a]",
  },
];

// DATA CONTOH: ganti dengan data asli (atau sambungkan ke database)
const BERITA = [
  {
    judul: "Judul berita contoh pertama",
    tanggal: "Tanggal berita",
    kategori: "Organisasi",
    ringkas:
      "Ini adalah contoh ringkasan berita. Ganti dengan ringkasan berita IKSAJ yang sebenarnya.",
  },
  {
    judul: "Judul berita contoh kedua",
    tanggal: "Tanggal berita",
    kategori: "Kegiatan",
    ringkas:
      "Ini adalah contoh ringkasan berita. Ganti dengan ringkasan berita IKSAJ yang sebenarnya.",
  },
  {
    judul: "Judul berita contoh ketiga",
    tanggal: "Tanggal berita",
    kategori: "Pengumuman",
    ringkas:
      "Ini adalah contoh ringkasan berita. Ganti dengan ringkasan berita IKSAJ yang sebenarnya.",
  },
];

// DATA CONTOH
const KARYA = [
  {
    judul: "Judul karya tulis contoh pertama",
    penulis: "Nama Penulis",
    jenis: "Esai",
  },
  {
    judul: "Judul karya tulis contoh kedua",
    penulis: "Nama Penulis",
    jenis: "Puisi",
  },
  {
    judul: "Judul karya tulis contoh ketiga",
    penulis: "Nama Penulis",
    jenis: "Opini",
  },
  {
    judul: "Judul karya tulis contoh keempat",
    penulis: "Nama Penulis",
    jenis: "Cerpen",
  },
];

// DATA CONTOH: ganti `src` dengan foto asli bila sudah ada
const GALERI = [
  { judul: "Dokumentasi 1", ket: "Harlah", tone: "from-[#FFD21F] to-[#FFB000]", span: "sm:col-span-2 sm:row-span-2" },
  { judul: "Dokumentasi 2", ket: "Bakti sosial", tone: "from-[#14110a] to-[#3a2f0b]", span: "" },
  { judul: "Dokumentasi 3", ket: "Ngaji organisasi", tone: "from-[#FFB000] to-[#FFD21F]", span: "" },
  { judul: "Dokumentasi 4", ket: "Sanggar Pelangi", tone: "from-[#3a2f0b] to-[#14110a]", span: "" },
  { judul: "Dokumentasi 5", ket: "Safari Ramadan", tone: "from-[#FBF6E6] to-[#FFD21F]", span: "sm:col-span-2" },
];

/* ---------- OBSERVER BERSAMA (1 observer untuk semua Reveal) ---------- */

const callbacks = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;

function observeOnce(el: Element, cb: () => void) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const fn = callbacks.get(entry.target);
          if (fn) fn();
          callbacks.delete(entry.target);
          sharedObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
  }
  callbacks.set(el, cb);
  sharedObserver.observe(el);
  return () => {
    callbacks.delete(el);
    sharedObserver?.unobserve(el);
  };
}

/* ---------- KOMPONEN KECIL ---------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setShow(true));
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: show ? `${delay}ms` : "0ms" }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Marker({ children }: { children: ReactNode }) {
  return (
    <span className="bg-[linear-gradient(transparent_62%,#FFD21F_62%)] px-1">
      {children}
    </span>
  );
}

function SectionTag({
  no,
  text,
  dark = false,
}: {
  no: string;
  text: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="rounded-full bg-[#FFD21F] px-3 py-1 text-xs font-bold tracking-widest text-[#14110a]">
        {no}
      </span>
      <span
        className={`text-xs font-semibold uppercase tracking-[0.3em] ${
          dark ? "text-[#FFD21F]" : "text-[#14110a]/60"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

function Logo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-[#FBF6E6] p-1"
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="Logo IKSAJ"
        width={size}
        height={size}
        priority
        className="h-full w-full object-contain"
      />
    </span>
  );
}

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

/* ---------- HALAMAN ---------- */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  const [drop, setDrop] = useState<string | null>(null); // dropdown desktop
  const [mobSub, setMobSub] = useState<string | null>(null); // accordion mobile
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);

  // tahun dibaca setelah render di browser (bukan saat prerender)
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // navbar berubah saat halaman digulir, tanpa event scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // tutup dropdown saat klik di luar atau tekan Escape
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
    <div
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-x-clip bg-[#14110a] font-[family-name:var(--font-body)] text-[#FBF6E6] selection:bg-[#FFD21F] selection:text-[#14110a]`}
    >
      <style>{`
        html, body { overflow-x: clip; max-width: 100%; }
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 4.5rem; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin360 { to { transform: rotate(360deg); } }
        .marquee-track { animation: marquee 30s linear infinite; will-change: transform; }
        .rope { stroke-dasharray: 2400; stroke-dashoffset: 2400; animation: draw 3.2s ease-out 0.4s forwards; }
        .floaty { animation: floaty 6s ease-in-out infinite; will-change: transform; }
        .spin-slow { animation: spin360 24s linear infinite; will-change: transform; }
        .outline-text { -webkit-text-stroke: 2px #FFD21F; color: transparent; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .marquee-track, .floaty, .spin-slow { animation: none; }
          .rope { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      {/* penanda posisi paling atas halaman */}
      <div ref={sentinelRef} aria-hidden className="absolute left-0 top-0 h-6 w-full" />

      {/* NAVBAR */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[padding,background-color] duration-300 ${
          scrolled || menuOpen
            ? "border-b border-[#FFD21F]/20 bg-[#14110a] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#beranda" onClick={closeAll} className="flex items-center gap-2.5">
            <Logo size={40} />
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              IKSAJ
            </span>
          </a>

          {/* menu desktop */}
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
                          <li key={c.id} role="none">
                            <a
                              role="menuitem"
                              href={`#${c.id}`}
                              onClick={closeAll}
                              className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-[#FFD21F] hover:text-[#14110a]"
                            >
                              <span className="block text-sm font-semibold">
                                {c.label}
                              </span>
                              <span className="block text-xs opacity-60">
                                {c.desc}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={closeAll}
                    className="rounded-full px-4 py-2 text-sm font-medium text-[#FBF6E6]/80 transition-colors hover:bg-[#FFD21F] hover:text-[#14110a]"
                  >
                    {n.label}
                  </a>
                </li>
              )
            )}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href={ADMIN_LOGIN_HREF}
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
                <span
                  className={`block h-0.5 w-5 bg-[#FFD21F] transition-transform ${
                    menuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-[#FFD21F] transition-opacity ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-[#FFD21F] transition-transform ${
                    menuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* menu mobile */}
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
                        <li key={c.id}>
                          <a
                            href={`#${c.id}`}
                            onClick={closeAll}
                            className="block rounded-2xl px-4 py-2.5 text-sm text-[#FBF6E6]/80 hover:bg-[#FFD21F] hover:text-[#14110a]"
                          >
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={closeAll}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-[#FFD21F] hover:text-[#14110a]"
                  >
                    {n.label}
                  </a>
                </li>
              )
            )}
            <li className="pt-2">
              <Link
                href={ADMIN_LOGIN_HREF}
                onClick={closeAll}
                className="block rounded-2xl bg-[#FFD21F] px-4 py-3 text-center text-sm font-bold text-[#14110a]"
              >
                🔒 Login Admin
              </Link>
            </li>
          </ul>
        )}
      </header>

      {/* HERO */}
      <section id="beranda" className="relative overflow-hidden pb-24 pt-36 md:pt-44">
        {/* cahaya kuning (gradien statis, tanpa blur) */}
        <div className="pointer-events-none absolute -right-40 -top-10 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,210,31,0.22)_0%,rgba(255,210,31,0)_65%)]" />
        <div className="pointer-events-none absolute -bottom-20 -left-48 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(255,176,0,0.14)_0%,rgba(255,176,0,0)_65%)]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FFD21F]/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#FFD21F]">
              <span className="h-2 w-2 rounded-full bg-[#FFD21F]" />
              Organisasi Daerah · PP. Annuqayah Lubangsa
            </p>

            <h1 className="font-[family-name:var(--font-display)] text-[22vw] font-extrabold leading-[0.85] tracking-tighter md:text-[9.5rem]">
              <span className="outline-text">IK</span>SAJ
            </h1>

            <p className="mt-6 max-w-xl font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug md:text-3xl">
              Berawal dari <Marker>persaudaraan</Marker>, tumbuh dalam{" "}
              <Marker>perjuangan</Marker>.
            </p>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#FBF6E6]/70">
              Ikatan Santri Annuqayah Jawa, wadah santri asal Jawa di Pondok
              Pesantren Annuqayah daerah Lubangsa, Guluk-Guluk, Sumenep, Jawa
              Timur.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#sejarah"
                className="group inline-flex items-center gap-2 rounded-full bg-[#FFD21F] px-7 py-3.5 font-bold text-[#14110a] transition-transform hover:-translate-y-0.5"
              >
                Telusuri Sejarah
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#kontak"
                className="inline-flex items-center rounded-full border border-[#FBF6E6]/30 px-7 py-3.5 font-semibold transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]"
              >
                Hubungi Kami
              </a>
            </div>
          </div>

          {/* lencana berputar */}
          <div className="relative mx-auto grid h-72 w-72 place-items-center md:h-80 md:w-80">
            <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0">
              <defs>
                <path
                  id="lingkar"
                  d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0"
                />
              </defs>
              <text
                className="fill-[#FFD21F]"
                fontSize="13.5"
                fontWeight="700"
                letterSpacing="3.2"
              >
                <textPath href="#lingkar">
                  IKATAN SANTRI ANNUQAYAH JAWA • SEJAK 1996 • LUBANGSA •
                </textPath>
              </text>
            </svg>
            <div className="floaty grid h-44 w-44 place-items-center rounded-full bg-[#FFD21F] text-center text-[#14110a] md:h-48 md:w-48">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em]">Sejak</p>
                <p className="font-[family-name:var(--font-display)] text-6xl font-extrabold leading-none">
                  1996
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest">
                  6 Agustus
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* tali ikatan */}
        <svg
          aria-hidden
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-20 w-full md:h-28"
        >
          <path
            className="rope"
            d="M0,70 C100,10 180,110 300,60 S500,10 600,65 S820,115 920,60 S1120,20 1200,70"
            fill="none"
            stroke="#FFD21F"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            className="rope"
            d="M0,85 C110,30 190,120 310,78 S510,28 610,82 S830,125 930,76 S1130,40 1200,86"
            fill="none"
            stroke="#FFB000"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </section>

      {/* MARQUEE: dibungkus overflow-hidden agar rotasi tidak memicu scroll horizontal */}
      <div className="overflow-hidden py-3">
        <div className="-ml-[3%] w-[106%] -rotate-1 border-y-4 border-[#14110a] bg-[#FFD21F] py-4 text-[#14110a]">
          <div className="marquee-track flex w-max whitespace-nowrap">
            {[...DAERAH, ...DAERAH].map((d, i) => (
              <span
                key={i}
                className="mx-6 flex items-center gap-6 font-[family-name:var(--font-display)] text-2xl font-extrabold uppercase tracking-tight md:text-4xl"
              >
                {d}
                <span className="text-xl">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* TENTANG */}
      <section id="tentang" className="bg-[#FBF6E6] py-24 text-[#14110a]">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-2">
          <Reveal>
            <SectionTag no="01" text="Tentang IKSAJ" />
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Rumah bagi santri <Marker>Jawa</Marker> di tanah Madura.
            </h2>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-lg leading-relaxed text-[#14110a]/80">
              IKSAJ (Ikatan Santri Annuqayah Jawa) adalah organisasi daerah
              (ORDA) di lingkungan Pondok Pesantren Annuqayah, daerah Lubangsa,
              Guluk-Guluk, Kabupaten Sumenep, Jawa Timur.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#14110a]/80">
              Organisasi ini menjadi wadah bagi santri asal wilayah Jawa untuk
              membangun persaudaraan, mengembangkan potensi, belajar
              berorganisasi, dan melaksanakan kegiatan keagamaan maupun sosial.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { n: "1996", t: "Tahun berdiri" },
                { n: "3", t: "Generasi wadah santri Jawa" },
                { n: "6", t: "Poin misi organisasi" },
              ].map((s) => (
                <div
                  key={s.t}
                  className="rounded-3xl border-2 border-[#14110a] bg-white p-4 shadow-[5px_5px_0_0_#FFD21F]"
                >
                  <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold md:text-4xl">
                    {s.n}
                  </p>
                  <p className="mt-1 text-xs font-medium leading-snug text-[#14110a]/70">
                    {s.t}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SEJARAH */}
      <section id="sejarah" className="relative py-24">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <SectionTag no="02" text="Sejarah" dark />
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Simpul demi simpul,{" "}
              <span className="text-[#FFD21F]">terikat jadi satu.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[#FBF6E6]/70">
              Kehadiran IKSAJ tidak lepas dari perjalanan panjang persaudaraan
              santri Jawa melalui berbagai perkumpulan pendahulu.
            </p>
          </Reveal>

          <div className="relative mt-16">
            {/* tali vertikal */}
            <div className="absolute bottom-0 left-4 top-0 w-1 rounded-full bg-gradient-to-b from-[#FFD21F] via-[#FFB000] to-[#FFD21F]/10 md:left-1/2 md:-translate-x-1/2" />

            <ul className="space-y-12">
              {TIMELINE.map((t, i) => {
                const kiri = i % 2 === 0;
                return (
                  <li
                    key={t.tahun}
                    className="relative pl-14 md:grid md:grid-cols-2 md:gap-16 md:pl-0"
                  >
                    {/* simpul */}
                    <span className="absolute left-0 top-2 grid h-9 w-9 place-items-center rounded-full border-4 border-[#14110a] bg-[#FFD21F] text-xs font-extrabold text-[#14110a] md:left-1/2 md:-translate-x-1/2">
                      {i + 1}
                    </span>

                    <Reveal
                      delay={80}
                      className={kiri ? "md:text-right" : "md:col-start-2"}
                    >
                      <p className="font-[family-name:var(--font-display)] text-4xl font-extrabold text-[#FFD21F] md:text-5xl">
                        {t.tahun}
                      </p>
                      <h3 className="mt-1 text-xl font-bold">{t.judul}</h3>
                      <p className="mt-2 leading-relaxed text-[#FBF6E6]/70">
                        {t.isi}
                      </p>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>

          <Reveal className="mt-16">
            <p className="rounded-3xl border border-dashed border-[#FFD21F]/50 p-5 text-sm leading-relaxed text-[#FBF6E6]/60">
              Catatan: kronologi di atas bersumber dari profil dan arsip berita
              resmi PP. Annuqayah Lubangsa. Daftar lengkap ketua sejak 1996 dan
              dokumen pendirian masih dalam proses penghimpunan.
            </p>
          </Reveal>
        </div>
      </section>

      {/* VISI MISI */}
      <section id="visi" className="bg-[#FFD21F] py-24 text-[#14110a]">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionTag no="03" text="Visi & Misi" />
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Arah langkah kami.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
            <Reveal>
              <div className="h-full rounded-[2rem] bg-[#14110a] p-8 text-[#FBF6E6] shadow-[8px_8px_0_0_#FFB000] md:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FFD21F]">
                  Visi
                </p>
                <p className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold leading-snug md:text-3xl">
                  Terbentuknya pribadi muslim yang bertakwa, berbudi luhur,
                  berilmu, cakap, bertanggung jawab, dan berkomitmen menegakkan
                  nilai-nilai keislaman dalam kehidupan sehari-hari.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-2">
              {MISI.map((m, i) => (
                <Reveal key={m} delay={i * 70}>
                  <div className="group h-full rounded-3xl border-2 border-[#14110a] bg-[#FBF6E6] p-5 transition-transform hover:-translate-y-1">
                    <span className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#FFB000] transition-colors group-hover:text-[#14110a]">
                      0{i + 1}
                    </span>
                    <p className="mt-2 text-sm font-medium leading-relaxed">{m}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KEGIATAN */}
      <section id="kegiatan" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionTag no="04" text="Kegiatan" dark />
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Dari panggung seni hingga <Marker>bakti sosial</Marker>.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {KEGIATAN.map((k, i) => (
              <Reveal key={k.judul} delay={i * 100}>
                <article
                  className={`${k.bg} ${k.rot} h-full rounded-[2rem] border-2 border-[#FFD21F]/30 p-7 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]`}
                >
                  <span className="inline-block rounded-full border-2 border-current px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]">
                    {k.label}
                  </span>
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight md:text-3xl">
                    {k.judul}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-80">{k.ket}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <p className="text-sm text-[#FBF6E6]/50">
              Kegiatan di atas merupakan dokumentasi tahun-tahun sebelumnya,
              bukan daftar program kerja yang sedang berjalan.
            </p>
          </Reveal>
        </div>
      </section>

      {/* BERITA */}
      <section id="berita" className="bg-[#FBF6E6] py-24 text-[#14110a]">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionTag no="05" text="Berita" />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                Kabar terbaru dari <Marker>IKSAJ</Marker>.
              </h2>
              <a
                href="#berita"
                className="rounded-full border-2 border-[#14110a] px-5 py-2 text-sm font-bold transition-colors hover:bg-[#14110a] hover:text-[#FBF6E6]"
              >
                Semua berita →
              </a>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BERITA.map((b, i) => (
              <Reveal key={b.judul} delay={i * 100}>
                <article className="group flex h-full flex-col rounded-3xl border-2 border-[#14110a] bg-white p-6 shadow-[5px_5px_0_0_#FFD21F] transition-transform hover:-translate-y-1">
                  <div className="mb-4 grid h-32 place-items-center rounded-2xl bg-[#FFD21F] font-[family-name:var(--font-display)] text-5xl font-extrabold">
                    0{i + 1}
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-widest">
                    <span className="rounded-full bg-[#14110a] px-3 py-1 text-[#FFD21F]">
                      {b.kategori}
                    </span>
                    <span className="text-[#14110a]/50">{b.tanggal}</span>
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-extrabold leading-snug">
                    {b.judul}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#14110a]/70">
                    {b.ringkas}
                  </p>
                  <span className="mt-5 text-sm font-bold">
                    Baca selengkapnya{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <p className="text-sm text-[#14110a]/50">
              Contoh: berita di atas masih data sementara, nanti dikelola
              melalui halaman admin.
            </p>
          </Reveal>
        </div>
      </section>

      {/* KARYA TULIS */}
      <section id="karya" className="py-24">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <SectionTag no="06" text="Karya Tulis" dark />
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Goresan pena <span className="text-[#FFD21F]">para santri.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[#FBF6E6]/70">
              Esai, puisi, opini, dan cerpen karya anggota IKSAJ.
            </p>
          </Reveal>

          <ul className="mt-12 divide-y divide-[#FFD21F]/20 border-y border-[#FFD21F]/20">
            {KARYA.map((k, i) => (
              <li key={k.judul}>
                <Reveal delay={i * 80}>
                  <a
                    href="#karya"
                    className="group flex flex-wrap items-center gap-x-6 gap-y-2 py-6 transition-colors hover:bg-[#FFD21F]/5 sm:flex-nowrap"
                  >
                    <span className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#FFD21F] md:text-4xl">
                      0{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold leading-snug md:text-xl">
                        {k.judul}
                      </h3>
                      <p className="text-sm text-[#FBF6E6]/60">
                        Oleh {k.penulis}
                      </p>
                    </div>
                    <span className="rounded-full border border-[#FFD21F]/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#FFD21F]">
                      {k.jenis}
                    </span>
                    <span className="text-xl text-[#FFD21F] transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-8">
            <p className="text-sm text-[#FBF6E6]/50">
              Contoh: daftar karya di atas masih data sementara.
            </p>
          </Reveal>
        </div>
      </section>

      {/* GALERI */}
      <section id="galeri" className="bg-[#FFD21F] py-24 text-[#14110a]">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionTag no="07" text="Galeri" />
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Momen yang <span className="underline decoration-[#14110a] decoration-4 underline-offset-8">terekam.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid auto-rows-[160px] gap-4 sm:grid-cols-2 md:auto-rows-[200px] lg:grid-cols-4">
            {GALERI.map((g, i) => (
              <Reveal key={g.judul} delay={i * 80} className={`${g.span} h-full`}>
                <figure
                  className={`group relative h-full overflow-hidden rounded-3xl border-2 border-[#14110a] bg-gradient-to-br ${g.tone}`}
                >
                  {/* ganti dengan <Image src="/galeri/foto.jpg" alt={g.judul} fill className="object-cover" /> */}
                  <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-[#14110a]/90 p-4 text-[#FBF6E6] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-[family-name:var(--font-display)] text-lg font-bold">
                      {g.judul}
                    </p>
                    <p className="text-xs text-[#FBF6E6]/70">{g.ket}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <p className="text-sm text-[#14110a]/60">
              Contoh: kotak warna di atas adalah tempat foto. Unggah dokumentasi
              asli melalui halaman admin.
            </p>
          </Reveal>
        </div>
      </section>

      {/* STRUKTUR */}
      <section id="struktur" className="bg-[#FBF6E6] py-24 text-[#14110a]">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionTag no="08" text="Struktur Organisasi" />
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Di bawah naungan <Marker>sistem ORDA</Marker> Lubangsa.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#14110a]/70">
              IKSAJ adalah bagian dari sistem Organisasi Daerah (ORDA) PP.
              Annuqayah Lubangsa. Pembinaan organisasi dilakukan oleh bagian
              P2O, yaitu pembinaan dan pengembangan organisasi.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara"].map((j) => (
                <div
                  key={j}
                  className="rounded-3xl border-2 border-dashed border-[#14110a]/40 bg-white p-6 text-center"
                >
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#FFD21F] text-2xl font-extrabold">
                    ?
                  </div>
                  <p className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold">
                    {j}
                  </p>
                  <p className="text-xs text-[#14110a]/50">Segera diperbarui</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-[#14110a]/60">
              Susunan pengurus periode terbaru akan ditampilkan setelah
              dikonfirmasi oleh pengurus.
            </p>
          </Reveal>
        </div>
      </section>

      {/* KONTAK */}
      <section id="kontak" className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute -bottom-48 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,210,31,0.18)_0%,rgba(255,210,31,0)_65%)]" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <div className="flex justify-center">
              <SectionTag no="09" text="Kontak" dark />
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
              Mari <span className="text-[#FFD21F]">terhubung.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[#FBF6E6]/70">
              Untuk menanyakan kontak pengurus IKSAJ terkini, silakan hubungi
              sekretariat PP. Annuqayah Lubangsa.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:sekretariat@lubangsa.org"
                className="w-full rounded-full bg-[#FFD21F] px-8 py-4 font-bold text-[#14110a] transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                ✉ sekretariat@lubangsa.org
              </a>
              <a
                href="tel:+6282302073377"
                className="w-full rounded-full border-2 border-[#FFD21F] px-8 py-4 font-bold text-[#FFD21F] transition-colors hover:bg-[#FFD21F] hover:text-[#14110a] sm:w-auto"
              >
                ☎ 0823-0207-3377
              </a>
            </div>
            <p className="mt-4 text-xs text-[#FBF6E6]/40">
              Kontak di atas adalah kontak sekretariat pesantren, bukan nomor
              pribadi pengurus IKSAJ.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#FFD21F]/20 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-center text-sm text-[#FBF6E6]/50 md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <p className="font-[family-name:var(--font-display)] text-base font-bold text-[#FBF6E6]">
              IKSAJ <span className="text-[#FFD21F]">✦</span> Merawat
              Persaudaraan, Mengembangkan Potensi
            </p>
          </div>
          <p>
            Informasi bersumber dari laman resmi PP. Annuqayah Lubangsa. ©{" "}
            {year ?? ""} IKSAJ.
          </p>
        </div>
      </footer>
    </div>
  );
}