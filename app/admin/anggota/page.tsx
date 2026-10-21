import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MEMBERS = [
  {
    id: "IKS-001",
    name: "Ahmad Fauzan",
    position: "Ketua Umum",
    division: "Pengurus Inti",
    status: "Aktif",
  },
  {
    id: "IKS-002",
    name: "Muhammad Rizki",
    position: "Sekretaris",
    division: "Pengurus Inti",
    status: "Aktif",
  },
  {
    id: "IKS-003",
    name: "Siti Aisyah",
    position: "Bendahara",
    division: "Pengurus Inti",
    status: "Aktif",
  },
  {
    id: "IKS-004",
    name: "Abdul Rahman",
    position: "Anggota",
    division: "Pendidikan",
    status: "Aktif",
  },
  {
    id: "IKS-005",
    name: "Nurul Hidayah",
    position: "Anggota",
    division: "Sosial",
    status: "Tidak aktif",
  },
];

export default async function AnggotaPage() {
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
      {/* Daftar anggota */}
      <section aria-label="Daftar anggota">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FBF6E6]/40">
              Ruang kerja
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight">
              Daftar anggota
            </h2>
          </div>

          {role === "admin" && (
            <Link
              href="/admin/anggota/tambah"
              className="rounded-full bg-[#FFD21F] px-5 py-2.5 text-sm font-bold text-[#14110a] transition-transform hover:-translate-y-0.5"
            >
              + Tambah anggota
            </Link>
          )}
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.025]">
          {/* Pencarian dan filter: tampilan awal */}
          <div className="flex flex-col gap-3 border-b border-[#FBF6E6]/10 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-extrabold">
                Semua anggota
              </h3>
              <p className="mt-1 text-xs text-[#FBF6E6]/45">
                Informasi anggota dan jabatan organisasi.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="search"
                placeholder="Cari anggota..."
                aria-label="Cari anggota"
                className="min-w-0 flex-1 rounded-full border border-[#FBF6E6]/15 bg-[#14110a]/70 px-4 py-2.5 text-sm text-[#FBF6E6] outline-none transition placeholder:text-[#FBF6E6]/30 focus:border-[#FFD21F]/50 sm:w-48"
              />

              <select
                aria-label="Filter status anggota"
                defaultValue="Semua status"
                className="rounded-full border border-[#FBF6E6]/15 bg-[#14110a] px-4 py-2.5 text-sm text-[#FBF6E6]/75 outline-none focus:border-[#FFD21F]/50"
              >
                <option>Semua status</option>
                <option>Aktif</option>
                <option>Tidak aktif</option>
              </select>
            </div>
          </div>

          {/* Daftar versi desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#FBF6E6]/10 bg-[#14110a]/40 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FBF6E6]/40">
                <tr>
                  <th className="px-6 py-4">Anggota</th>
                  <th className="px-6 py-4">Jabatan</th>
                  <th className="px-6 py-4">Divisi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#FBF6E6]/[0.07]">
                {MEMBERS.map((member, index) => (
                  <tr
                    key={member.id}
                    className="transition-colors hover:bg-[#FFD21F]/[0.035]"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.04] font-[family-name:var(--font-display)] text-sm font-extrabold ${
                            index % 3 === 0
                              ? "text-[#FFD21F]"
                              : index % 3 === 1
                                ? "text-[#FBF6E6]"
                                : "text-[#F97316]"
                          }`}
                        >
                          {member.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-bold text-[#FBF6E6]">
                            {member.name}
                          </p>
                          <p className="mt-1 text-xs text-[#FBF6E6]/35">
                            {member.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-[#FBF6E6]/70">
                      {member.position}
                    </td>

                    <td className="px-6 py-5 text-[#FBF6E6]/50">
                      {member.division}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={member.status} />
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/anggota/${member.id}`}
                          className="text-xs font-bold text-[#FBF6E6]/55 transition-colors hover:text-[#FFD21F]"
                        >
                          Detail ↗
                        </Link>

                        {role === "admin" && (
                          <Link
                            href={`/admin/anggota/${member.id}/edit`}
                            className="text-xs font-bold text-[#FBF6E6]/55 transition-colors hover:text-[#F97316]"
                          >
                            Edit
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Daftar versi mobile */}
          <div className="space-y-3 p-4 md:hidden">
            {MEMBERS.map((member, index) => (
              <article
                key={member.id}
                className="rounded-2xl border border-[#FBF6E6]/10 bg-[#14110a]/65 p-4 transition-colors hover:border-[#FFD21F]/30"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.04] font-[family-name:var(--font-display)] font-extrabold ${
                      index % 3 === 0
                        ? "text-[#FFD21F]"
                        : index % 3 === 1
                          ? "text-[#FBF6E6]"
                          : "text-[#F97316]"
                    }`}
                  >
                    {member.name.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-bold">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#FBF6E6]/35">
                      {member.id}
                    </p>
                    <p className="mt-3 text-sm text-[#FBF6E6]/65">
                      {member.position}
                    </p>
                    <p className="mt-1 text-xs text-[#FBF6E6]/40">
                      {member.division}
                    </p>
                    <div className="mt-3">
                      <StatusBadge status={member.status} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-4 border-t border-[#FBF6E6]/10 pt-3">
                  <Link
                    href={`/admin/anggota/${member.id}`}
                    className="text-xs font-bold text-[#FBF6E6]/55 transition-colors hover:text-[#FFD21F]"
                  >
                    Lihat detail ↗
                  </Link>

                  {role === "admin" && (
                    <Link
                      href={`/admin/anggota/${member.id}/edit`}
                      className="text-xs font-bold text-[#FBF6E6]/55 transition-colors hover:text-[#F97316]"
                    >
                      Edit anggota
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#FBF6E6]/10 px-5 py-4 text-xs text-[#FBF6E6]/35 md:px-6">
            <span>Menampilkan {MEMBERS.length} data contoh</span>
            <span>IKSAJ · Data anggota</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-[#FBF6E6]/10 pt-5 text-xs text-[#FBF6E6]/35">
        <span>
          Masuk sebagai{" "}
          <span className="text-[#FBF6E6]/70">{name}</span>
        </span>
        <span>Panel kontrol IKSAJ</span>
      </footer>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Aktif";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
        isActive
          ? "border-[#FFD21F]/25 bg-[#FFD21F]/[0.07] text-[#FFD21F]"
          : "border-[#F97316]/25 bg-[#F97316]/[0.07] text-[#F97316]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-[#FFD21F]" : "bg-[#F97316]"
        }`}
      />
      {status}
    </span>
  );
}