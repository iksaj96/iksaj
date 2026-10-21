
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardStorage from "./components/DashboardStorage";

const CONTENT_AREAS = [
  {
    label: "Berita",
    description: "Kabar terbaru dan kegiatan IKSAJ.",
    href: "/admin/berita",
    number: "01",
    icon: "✳",
    accent: "text-[#FFD21F]",
    glow: "group-hover:bg-[#FFD21F]/[0.07]",
  },
  {
    label: "Karya tulis",
    description: "Tulisan, ide, dan cerita anggota.",
    href: "/admin/karya",
    number: "02",
    icon: "↗",
    accent: "text-[#FBF6E6]",
    glow: "group-hover:bg-[#FBF6E6]/[0.05]",
  },
  {
    label: "Galeri",
    description: "Foto dan dokumentasi kegiatan.",
    href: "/admin/galeri",
    number: "03",
    icon: "▧",
    accent: "text-[#F97316]",
    glow: "group-hover:bg-[#F97316]/[0.06]",
  },
];

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
    >
      <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />
    </svg>
  );
}

export default async function AdminHome() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let name = "Admin";
  let role = "member";

  if (user) {
    name = user.email?.split("@")[0] ?? "Admin";

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) name = profile.full_name;
    if (profile?.role) role = profile.role;
  }

  const isAdmin = role === "admin";

  return (
    <main className="mx-auto w-full max-w-[1600px] px-2.5 py-3 sm:px-4 sm:py-4 lg:px-5">
      <div className="space-y-3">
        {!isAdmin && (
          <div
            role="alert"
            className="animate-dashboard-in flex items-start gap-3 rounded-md border border-red-400/30 bg-red-400/[0.07] px-3 py-2.5 text-sm text-red-200"
          >
            <span className="mt-0.5 font-bold">!</span>
            <p className="leading-relaxed">
              Akun ini belum berstatus admin sehingga belum bisa mengubah
              konten. Ubah kolom <code>role</code> di tabel{" "}
              <code>profiles</code> menjadi <code>admin</code>.
            </p>
          </div>
        )}

        {/* Header */}
        <header
          className="dashboard-enter relative isolate overflow-hidden rounded-lg border border-[#FFD21F]/20 bg-[#1c190f] p-4 sm:p-5"
          style={{ animationDelay: "40ms" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 -z-10 h-48 w-48 rounded-full border-[22px] border-[#FFD21F]/[0.06] sm:-right-5 sm:-top-20 sm:h-60 sm:w-60 sm:border-[30px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-8 top-0 h-1 w-16 animate-dashboard-line bg-[#FFD21F] sm:right-16"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[#FFD21F]">
                  <SparkIcon />
                </span>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#FFD21F]/80">
                  IKSAJ · Ruang pengelola
                </p>
              </div>

              <h1 className="break-words font-[family-name:var(--font-display)] text-2xl font-black leading-tight tracking-tight text-[#FBF6E6] sm:text-3xl lg:text-4xl">
                Halo,{" "}
                <span className="relative inline-block text-[#FFD21F]">
                  {name}.
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-[2px] w-2/3 origin-left animate-dashboard-underline rounded-full bg-[#FFD21F]"
                  />
                </span>
              </h1>

              <p className="mt-2 max-w-lg text-xs leading-relaxed text-[#FBF6E6]/55 sm:text-sm">
                Satu ruang untuk merawat cerita, gagasan, dan dokumentasi
                perjalanan IKSAJ.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start rounded-md border border-[#FFD21F]/20 bg-[#FFD21F]/[0.07] px-2.5 py-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAdmin
                    ? "animate-status-pulse bg-[#FFD21F]"
                    : "bg-[#FBF6E6]/40"
                }`}
              />
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#FBF6E6]/80">
                {isAdmin ? "Administrator" : "Anggota"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href="/admin/drive"
              className="group inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-[#FFD21F] px-3.5 py-2 text-xs font-extrabold text-[#14110a] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ffe36a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F] active:translate-y-0"
            >
              Buka IKSAJ Drive
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-[#FBF6E6]/15 px-3.5 py-2 text-xs font-bold text-[#FBF6E6]/75 transition duration-200 hover:border-[#FFD21F]/40 hover:bg-[#FBF6E6]/[0.04] hover:text-[#FFD21F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F]"
            >
              Lihat situs
              <ArrowIcon className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Konten utama */}
        <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.88fr)]">
          {/* Kelola konten */}
          <section
            aria-label="Kelola konten"
            className="dashboard-enter min-w-0"
            style={{ animationDelay: "140ms" }}
          >
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#FBF6E6]/35">
                  Ruang kerja
                </p>
                <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-[#FBF6E6] sm:text-xl">
                  Kelola konten
                </h2>
              </div>

              <span className="pb-0.5 text-[10px] text-[#FBF6E6]/40">
                03 area
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {CONTENT_AREAS.map((area, index) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className={`dashboard-enter group relative isolate flex min-w-0 items-center gap-2.5 overflow-hidden rounded-md border border-[#FBF6E6]/10 bg-[#1a170f] p-3 transition duration-300 hover:-translate-y-0.5 hover:border-[#FFD21F]/35 hover:shadow-[0_5px_16px_rgba(0,0,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F] ${area.glow}`}
                  style={{ animationDelay: `${200 + index * 80}ms` }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[2px] origin-bottom scale-y-0 bg-[#FFD21F] transition-transform duration-300 group-hover:scale-y-100"
                  />

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.03] font-[family-name:var(--font-display)] text-base font-black transition duration-300 group-hover:rotate-[-4deg] group-hover:border-[#FFD21F]/25 group-hover:bg-[#FFD21F]/10 ${area.accent}`}
                  >
                    {area.icon}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2">
                      <span className="font-[family-name:var(--font-display)] text-sm font-extrabold text-[#FBF6E6]">
                        {area.label}
                      </span>
                      <span className="text-[9px] font-bold tracking-widest text-[#FBF6E6]/25">
                        {area.number}
                      </span>
                    </span>

                    <span className="mt-0.5 block text-[10px] leading-relaxed text-[#FBF6E6]/45 sm:text-[11px]">
                      {area.description}
                    </span>
                  </span>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#FBF6E6]/30 transition duration-300 group-hover:translate-x-0.5 group-hover:bg-[#FFD21F]/10 group-hover:text-[#FFD21F]">
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-[#FBF6E6]/[0.08] pt-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD21F]" />
              <p className="text-[10px] leading-relaxed text-[#FBF6E6]/35">
                Pilih area untuk mulai mengelola konten situs.
              </p>
            </div>
          </section>

          {/* Penyimpanan */}
          <section
            aria-label="Penyimpanan IKSAJ"
            className="dashboard-enter min-w-0"
            style={{ animationDelay: "260ms" }}
          >
            <DashboardStorage />
          </section>
        </div>
      </div>
    </main>
  );
}
