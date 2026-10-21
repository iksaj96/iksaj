import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import OrganizationPage from "../components/OrganizationPage";

export const metadata: Metadata = {
  title: "Struktur Organisasi IKSAJ",
  description:
    "Kenali susunan pengurus aktif Ikatan Santri Annuqayah Jawa (IKSAJ).",
  alternates: { canonical: "/struktur" },
};

type Pengurus = {
  id: string;
  nama: string;
  jabatan: string | null;
  peran: "koordinator" | "anggota" | null;
  urutan: number;
};

type Seksi = {
  id: string;
  nama: string;
  deskripsi: string | null;
  urutan: number;
  pengurus: Pengurus[];
};

async function StrukturAktif() {
  const supabase = await createClient();
  const { data: periode, error: periodeError } = await supabase
    .from("periode")
    .select("id, nama")
    .eq("aktif", true)
    .maybeSingle();

  if (periodeError) {
    throw new Error("Gagal memuat periode struktur organisasi.", {
      cause: periodeError,
    });
  }

  if (!periode) {
    return (
      <p className="rounded-3xl border-2 border-dashed border-[#FFD21F]/30 p-8 text-center text-[#FBF6E6]/60">
        Struktur pengurus aktif belum tersedia.
      </p>
    );
  }

  const { data, error } = await supabase
    .from("seksi")
    .select(
      "id, nama, deskripsi, urutan, pengurus(id, nama, jabatan, peran, urutan)"
    )
    .eq("periode_id", periode.id)
    .order("urutan", { ascending: true })
    .order("urutan", { referencedTable: "pengurus", ascending: true });

  if (error) {
    throw new Error("Gagal memuat susunan pengurus.", { cause: error });
  }

  const seksiList = (data ?? []) as Seksi[];
  const jumlahPengurus = seksiList.reduce(
    (total, seksi) => total + seksi.pengurus.length,
    0
  );

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-[#FFD21F] p-7 text-[#14110a] md:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[28px] border-[#14110a]/[0.06] md:h-72 md:w-72"
        />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.25em]">
            Kepengurusan aktif
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight md:text-5xl">
            Periode {periode.nama}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#14110a]/70 md:text-base">
            Susunan pengurus IKSAJ yang sedang menjalankan amanah untuk
            mengembangkan organisasi dan menjaga kebersamaan anggota.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.12em]">
            <span className="rounded-full bg-[#14110a] px-4 py-2 text-[#FFD21F]">
              {seksiList.length} seksi
            </span>
            <span className="rounded-full border border-[#14110a]/20 px-4 py-2">
              {jumlahPengurus} pengurus
            </span>
          </div>
        </div>
      </section>

      {seksiList.length === 0 ? (
        <p className="mt-8 rounded-3xl border-2 border-dashed border-[#FFD21F]/30 p-8 text-center text-[#FBF6E6]/60">
          Susunan seksi untuk periode ini belum tersedia.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {seksiList.map((seksi, index) => (
            <section
              key={seksi.id}
              aria-labelledby={`seksi-${seksi.id}`}
              className="rounded-3xl border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.025] p-5 md:p-6"
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFD21F] font-[family-name:var(--font-display)] text-sm font-extrabold text-[#14110a]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3
                    id={`seksi-${seksi.id}`}
                    className="font-[family-name:var(--font-display)] text-xl font-extrabold"
                  >
                    {seksi.nama}
                  </h3>
                  {seksi.deskripsi && (
                    <p className="mt-1 text-sm leading-relaxed text-[#FBF6E6]/55">
                      {seksi.deskripsi}
                    </p>
                  )}
                </div>
              </div>

              {seksi.pengurus.length === 0 ? (
                <p className="mt-5 rounded-2xl border border-[#FBF6E6]/10 px-4 py-3 text-sm text-[#FBF6E6]/45">
                  Belum ada pengurus di seksi ini.
                </p>
              ) : (
                <ul className="mt-5 space-y-2">
                  {seksi.pengurus.map((orang) => (
                    <li
                      key={orang.id}
                      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
                        orang.peran === "koordinator"
                          ? "border-[#FFD21F]/25 bg-[#FFD21F]/[0.06]"
                          : "border-[#FBF6E6]/10 bg-black/10"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {orang.nama}
                        </p>
                        {orang.jabatan && (
                          <p className="mt-0.5 truncate text-xs text-[#FBF6E6]/50">
                            {orang.jabatan}
                          </p>
                        )}
                      </div>
                      {orang.peran && (
                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                            orang.peran === "koordinator"
                              ? "border-[#FFD21F]/30 text-[#FFD21F]"
                              : "border-[#FBF6E6]/15 text-[#FBF6E6]/55"
                          }`}
                        >
                          {orang.peran}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function StrukturLoading() {
  return (
    <p
      role="status"
      className="rounded-3xl border-2 border-dashed border-[#FFD21F]/30 p-8 text-center text-[#FBF6E6]/60"
    >
      Memuat struktur organisasi...
    </p>
  );
}

export default function StrukturPage() {
  return (
    <OrganizationPage
      eyebrow="Keluarga besar IKSAJ"
      title="Mengenal pengurus dan seksi organisasi."
      description="Susunan kepengurusan periode aktif Ikatan Santri Annuqayah Jawa, PP. Annuqayah Daerah Lubangsa."
    >
      <Suspense fallback={<StrukturLoading />}>
        <StrukturAktif />
      </Suspense>
    </OrganizationPage>
  );
}
