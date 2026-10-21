import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardStorage from "./components/DashboardStorage";

const CONTENT_AREAS = [
  {
    label: "Berita",
    description: "Kabar terbaru dan kegiatan IKSAJ.",
    href: "/admin/berita",
    number: "01",
    icon: "news",
    accent: "text-[#FFD21F]",
    glow: "group-hover:bg-[#FFD21F]/[0.07]",
  },
  {
    label: "Karya tulis",
    description: "Tulisan, ide, dan cerita anggota.",
    href: "/admin/karya",
    number: "02",
    icon: "book",
    accent: "text-[#FBF6E6]",
    glow: "group-hover:bg-[#FBF6E6]/[0.05]",
  },
  {
    label: "Galeri",
    description: "Foto dan dokumentasi kegiatan.",
    href: "/admin/galeri",
    number: "03",
    icon: "gallery",
    accent: "text-[#F97316]",
    glow: "group-hover:bg-[#F97316]/[0.06]",
  },
] as const;

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
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />
    </svg>
  );
}

function ContentIcon({ name }: { name: (typeof CONTENT_AREAS)[number]["icon"] }) {
  const commonProps = {
    "aria-hidden": true as const,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
  };

  switch (name) {
    case "news":
      return (
        <svg {...commonProps}>
          <path d="M4 4.5h12a2 2 0 0 1 2 2V20H6a2 2 0 0 1-2-2V4.5Z" />
          <path d="M18 8h2a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2" />
          <path d="M8 9h5M8 13h8M8 16.5h6" />
          <path d="M8 6.8h5" />
        </svg>
      );

    case "book":
      return (
        <svg {...commonProps}>
          <path d="M12 7v14" />
          <path d="M12 7C9.5 4.8 6.5 4.2 3 5v14c3.5-.8 6.5-.2 9 2" />
          <path d="M12 7c2.5-2.2 5.5-2.8 9-2v14c-3.5-.8-6.5-.2-9 2" />
          <path d="M6 9h2M6 12h3M16 9h2M15 12h3" />
        </svg>
      );

    case "gallery":
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
          <path d="m12 21 4-4" />
        </svg>
      );
  }
}

function DeveloperSupport() {
  return (
    <section
      aria-labelledby="developer-support-title"
      className="dashboard-enter relative isolate overflow-hidden rounded-lg border border-[#FFD21F]/20 bg-[#1c190f] p-4 sm:p-5"
      style={{ animationDelay: "340ms" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 -z-10 h-36 w-36 rounded-full border-[18px] border-[#FFD21F]/[0.05] sm:h-44 sm:w-44"
      />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#FFD21F]/20 bg-[#FFD21F]/[0.08] text-[#FFD21F]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#FFD21F]/70">
            Bantuan & dukungan
          </p>

          <h2
            id="developer-support-title"
            className="mt-1 font-[family-name:var(--font-display)] text-lg font-extrabold text-[#FBF6E6] sm:text-xl"
          >
            Mengalami kendala?
          </h2>

          <p className="mt-2 max-w-2xl text-xs leading-6 text-[#FBF6E6]/60 sm:text-sm">
            Jika mengalami kendala atau membutuhkan bantuan terkait
            website IKSAJ, silakan hubungi pengembang melalui situs
            web pengembang. Gunakan akun berikut untuk masuk ke fitur
            chat yang tersedia.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-[#FBF6E6]/10 bg-[#14110a]/60 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FBF6E6]/40">
          Informasi akun chat
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-[10px] text-[#FBF6E6]/40">Username</p>
            <p className="mt-1 break-all font-mono text-sm font-semibold text-[#FBF6E6]">
              iksaj
            </p>
          </div>

          <div>
            <p className="text-[10px] text-[#FBF6E6]/40">Password</p>
            <p className="mt-1 break-all font-mono text-sm font-semibold text-[#FBF6E6]">
              lubangsa
            </p>
          </div>
        </div>

        <p className="mt-3 text-[10px] leading-relaxed text-[#FBF6E6]/35">
          Informasi akun ini dapat dilihat oleh pengguna dashboard.
          Pastikan akun tersebut memang disiapkan khusus untuk
          keperluan bantuan pengembang.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold text-[#FBF6E6]">
            Adlan Madjied Ridho
          </p>
          <p className="mt-1 text-[10px] text-[#FBF6E6]/40">
            Pengembang website IKSAJ
          </p>
        </div>

        <Link
          href="https://adlanmr.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#FFD21F] px-4 py-2.5 text-xs font-extrabold text-[#14110a] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ffe36a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F] active:translate-y-0"
        >
          Hubungi Pengembang
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

function DeveloperCredit() {
  return (
    <footer
      className="dashboard-enter border-t border-[#FBF6E6]/[0.08] pt-4"
      style={{ animationDelay: "400ms" }}
    >
      <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="text-[10px] leading-relaxed text-[#FBF6E6]/35">
          Dikembangkan oleh{" "}
          <span className="font-semibold text-[#FBF6E6]/60">
            Adlan Madjied Ridho
          </span>
        </p>

        <a
          href="https://adlanmr.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 text-[10px] font-semibold text-[#FFD21F]/70 transition hover:text-[#FFD21F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F] sm:justify-end"
        >
          adlanmr.vercel.app
          <ArrowIcon className="h-3 w-3" />
        </a>
      </div>
    </footer>
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
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.03] transition duration-300 group-hover:rotate-[-4deg] group-hover:border-[#FFD21F]/25 group-hover:bg-[#FFD21F]/10 ${area.accent}`}
                  >
                    <ContentIcon name={area.icon} />
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

        {/* Bantuan pengembang */}
        <DeveloperSupport />

        {/* Kredit pengembang */}
        <DeveloperCredit />
      </div>
    </main>
  );
}