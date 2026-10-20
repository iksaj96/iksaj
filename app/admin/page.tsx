import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATS = [
  { label: "Berita", href: "/admin/berita", note: "Belum terhubung ke database" },
  { label: "Karya Tulis", href: "/admin/karya", note: "Belum terhubung ke database" },
  { label: "Galeri", href: "/admin/galeri", note: "Belum terhubung ke database" },
];

const QUICK = [
  { label: "Tulis berita baru", href: "/admin/berita" },
  { label: "Tambah karya tulis", href: "/admin/karya" },
  { label: "Unggah foto galeri", href: "/admin/galeri" },
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
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FFD21F]">
        Dashboard
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
        Halo, <span className="text-[#FFD21F]">{name}.</span>
      </h1>
      <p className="mt-3 max-w-xl text-[#FBF6E6]/70">
        Kelola konten situs IKSAJ dari sini: berita, karya tulis, dan galeri.
      </p>

      {role !== "admin" && (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          Akun ini belum berstatus admin, jadi belum bisa mengubah konten.
          Ubah kolom <code>role</code> di tabel <code>profiles</code> menjadi{" "}
          <code>admin</code>.
        </p>
      )}

      {/* ringkasan */}
      <section aria-label="Ringkasan" className="mt-10 grid gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-3xl border-2 border-[#FFD21F]/30 bg-[#FBF6E6]/5 p-5 transition-transform hover:-translate-y-1 hover:border-[#FFD21F]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FBF6E6]/50">
              {s.label}
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-5xl font-extrabold text-[#FFD21F]">
              —
            </p>
            <p className="mt-2 text-xs text-[#FBF6E6]/50">{s.note}</p>
          </Link>
        ))}
      </section>

      {/* aksi cepat */}
      <section aria-label="Aksi cepat" className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight">
          Aksi cepat
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {QUICK.map((q) => (
            <Link
              key={q.label}
              href={q.href}
              className="rounded-full bg-[#FFD21F] px-6 py-3 text-sm font-bold text-[#14110a] transition-transform hover:-translate-y-0.5"
            >
              {q.label}
            </Link>
          ))}
        </div>
      </section>

      {/* langkah berikutnya */}
      <section
        aria-label="Langkah berikutnya"
        className="mt-12 rounded-3xl border border-dashed border-[#FFD21F]/50 p-6"
      >
        <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold">
          Langkah berikutnya
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#FBF6E6]/70">
          <li>✦ Buat tabel berita, karya tulis, dan galeri di Supabase.</li>
          <li>✦ Buat halaman pengelola di /admin/berita, /admin/karya, dan /admin/galeri.</li>
          <li>✦ Sambungkan data ke halaman publik agar angka di atas terisi.</li>
        </ul>
      </section>
    </div>
  );
}