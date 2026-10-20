import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardStorage from "./components/DashboardStorage";

const CONTENT_AREAS = [
  {
    label: "Berita",
    description: "Tulis kabar terbaru dan informasi kegiatan IKSAJ.",
    href: "/admin/berita",
    number: "01",
    accent: "text-[#FFD21F]",
  },
  {
    label: "Karya tulis",
    description: "Atur tulisan, ide, dan cerita dari anggota.",
    href: "/admin/karya",
    number: "02",
    accent: "text-[#FBF6E6]",
  },
  {
    label: "Galeri",
    description: "Pilih foto dan dokumentasikan momen kegiatan.",
    href: "/admin/galeri",
    number: "03",
    accent: "text-[#F97316]",
  },
];

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

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
      {role !== "admin" && (
        <p
          role="alert"
          className="mb-5 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          Akun ini belum berstatus admin, jadi belum bisa mengubah konten.
          Ubah kolom <code>role</code> di tabel <code>profiles</code> menjadi{" "}
          <code>admin</code>.
        </p>
      )}

      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,1fr)]">
        {/* Kolom kiri: sapaan + kelola konten */}
        <div className="flex flex-col gap-5">
          <header className="relative overflow-hidden rounded-[2rem] border border-[#FFD21F]/20 bg-[#FBF6E6]/[0.04] px-6 py-7 md:px-8 md:py-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[1.5rem] border-[#FFD21F]/[0.07]"
            />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#FFD21F]">
                  Panel kontrol IKSAJ
                </p>
                <h1 className="mt-3 break-words font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                  Halo, <span className="text-[#FFD21F]">{name}.</span>
                </h1>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#FBF6E6]/65 md:text-base">
                  Semua yang kamu perlukan untuk mengelola cerita dan
                  dokumentasi IKSAJ, dalam satu tempat.
                </p>
              </div>
              <span className="rounded-full border border-[#FFD21F]/30 bg-[#FFD21F]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD21F]">
                {role === "admin" ? "Administrator" : "Anggota"}
              </span>
            </div>
            <div className="relative mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/drive"
                className="rounded-full bg-[#FFD21F] px-5 py-2.5 text-sm font-bold text-[#14110a] transition-transform hover:-translate-y-0.5"
              >
                Buka IKSAJ Drive <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="/"
                className="rounded-full border border-[#FBF6E6]/20 px-5 py-2.5 text-sm font-semibold text-[#FBF6E6]/80 transition-colors hover:border-[#FFD21F]/50 hover:text-[#FFD21F]"
              >
                Lihat situs
              </Link>
            </div>
          </header>

          <section aria-label="Kelola konten" className="flex flex-1 flex-col">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FBF6E6]/40">
                  Ruang kerja
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight">
                  Kelola konten
                </h2>
              </div>
              <span className="pb-1 text-xs text-[#FBF6E6]/45">Pilih area</span>
            </div>
            <div className="grid flex-1 auto-rows-fr gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {CONTENT_AREAS.map((area) => (
                <Link
                  key={area.label}
                  href={area.href}
                  className="group flex items-center gap-4 rounded-2xl border border-[#FBF6E6]/10 bg-[#14110a]/65 p-4 transition-all hover:-translate-y-0.5 hover:border-[#FFD21F]/45 hover:bg-[#FFD21F]/[0.04]"
                >
                  <span
                    className={`font-[family-name:var(--font-display)] text-2xl font-extrabold ${area.accent}`}
                  >
                    {area.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-[family-name:var(--font-display)] text-lg font-extrabold">
                      {area.label}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-[#FBF6E6]/50">
                      {area.description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-lg text-[#FBF6E6]/35 transition-transform group-hover:translate-x-1 group-hover:text-[#FFD21F]"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Kolom kanan: ruang penyimpanan */}
        <DashboardStorage />
      </div>
    </div>
  );
}