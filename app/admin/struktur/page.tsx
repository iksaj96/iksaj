import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  aktifkanPeriode,
  hapusPengurus,
  hapusPeriode,
  hapusSeksi,
  tambahPengurus,
  tambahPeriode,
  tambahSeksi,
  ubahPengurus,
  ubahPeriode,
  ubahSeksi,
  urutkanPengurus,
  urutkanPeriode,
  urutkanSeksi,
} from "./actions";
import { HapusButton } from "./hapus-button";
import { Modal } from "./modal";
import { SortableList } from "./sortable-list";

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

type PeriodeRow = {
  id: string;
  nama: string;
  aktif: boolean;
  urutan: number;
  seksi: { count: number }[];
};

/* ---------- gaya bersama ---------- */

const inputCls =
  "mt-1 w-full rounded-xl border border-[#FBF6E6]/15 bg-black/30 px-3 py-2 text-sm normal-case tracking-normal text-[#FBF6E6] outline-none placeholder:text-[#FBF6E6]/30 focus:border-[#FFD21F]/50";
const btnPrimary =
  "shrink-0 whitespace-nowrap rounded-full bg-[#FFD21F] px-4 py-2 text-xs font-bold text-[#14110a] transition-transform hover:-translate-y-0.5";
const btnGhost =
  "shrink-0 whitespace-nowrap rounded-full border border-[#FBF6E6]/20 px-4 py-2 text-xs font-semibold text-[#FBF6E6]/80 transition-colors hover:border-[#FFD21F]/50 hover:text-[#FFD21F]";
const btnDanger =
  "rounded-full border border-red-400/40 px-4 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-400/10";
const btnLink =
  "text-xs font-bold text-[#FBF6E6]/55 transition-colors hover:text-[#FFD21F]";

/* ---------- komponen kecil ---------- */

function Folder({ aktif }: { aktif: boolean }) {
  return (
    <svg
      viewBox="0 0 64 52"
      aria-hidden="true"
      className={`h-16 w-20 transition-transform group-hover:-translate-y-0.5 ${
        aktif ? "text-[#FFD21F]" : "text-[#FBF6E6]/30"
      }`}
    >
      <path
        d="M4 10a4 4 0 0 1 4-4h14l6 6h28a4 4 0 0 1 4 4v4H4z"
        fill="currentColor"
        opacity="0.55"
      />
      <rect x="4" y="16" width="56" height="32" rx="4" fill="currentColor" />
    </svg>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#FBF6E6]/40">
      {label}
      {children}
    </label>
  );
}

function Hidden({ name, value }: { name: string; value: string }) {
  return <input type="hidden" name={name} value={value} />;
}

function SeksiFields({ seksi }: { seksi?: Seksi }) {
  return (
    <div className="space-y-3">
      <Field label="Nama seksi">
        <input
          name="nama"
          required
          defaultValue={seksi?.nama}
          placeholder="Contoh: Seksi Pendidikan"
          className={inputCls}
        />
      </Field>

      <Field label="Keterangan (opsional)">
        <input
          name="deskripsi"
          defaultValue={seksi?.deskripsi ?? ""}
          className={inputCls}
        />
      </Field>
    </div>
  );
}

function PengurusFields({ orang }: { orang?: Pengurus }) {
  return (
    <div className="space-y-3">
      <Field label="Nama">
        <input
          name="nama"
          required
          defaultValue={orang?.nama}
          className={inputCls}
        />
      </Field>

      <Field label="Jabatan (opsional)">
        <input
          name="jabatan"
          defaultValue={orang?.jabatan ?? ""}
          placeholder="Contoh: Ketua Umum"
          className={inputCls}
        />
      </Field>

      <Field label="Peran (opsional)">
        <select
          name="peran"
          defaultValue={orang?.peran ?? ""}
          className={inputCls}
        >
          <option value="">Tidak ditentukan</option>
          <option value="koordinator">Koordinator</option>
          <option value="anggota">Anggota</option>
        </select>
      </Field>
    </div>
  );
}

function OrangSummary({ orang }: { orang: Pengurus }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{orang.nama}</p>
        {orang.jabatan && (
          <p className="mt-0.5 truncate text-xs text-[#FBF6E6]/45">
            {orang.jabatan}
          </p>
        )}
      </div>

      {orang.peran && (
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
            orang.peran === "koordinator"
              ? "border-[#FFD21F]/25 bg-[#FFD21F]/[0.07] text-[#FFD21F]"
              : "border-[#FBF6E6]/15 text-[#FBF6E6]/55"
          }`}
        >
          {orang.peran}
        </span>
      )}
    </div>
  );
}

/* ---------- isi satu seksi ---------- */

function SeksiBlock({
  seksi,
  periodeId,
  isAdmin,
}: {
  seksi: Seksi;
  periodeId: string;
  isAdmin: boolean;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 py-1">
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold">
            {seksi.nama}
          </h2>
          {seksi.deskripsi && (
            <p className="mt-1 text-xs text-[#FBF6E6]/45">{seksi.deskripsi}</p>
          )}
        </div>

        {isAdmin && (
          <Modal
            title={`Edit seksi`}
            trigger="Edit"
            triggerClassName={`${btnLink} mt-1 shrink-0`}
          >
            <div className="space-y-5">
              <form action={ubahSeksi} className="space-y-4">
                <Hidden name="id" value={seksi.id} />
                <Hidden name="periode_id" value={periodeId} />
                <SeksiFields seksi={seksi} />
                <button type="submit" className={btnPrimary}>
                  Simpan perubahan
                </button>
              </form>

              <form
                action={hapusSeksi}
                className="border-t border-[#FBF6E6]/10 pt-4"
              >
                <Hidden name="id" value={seksi.id} />
                <Hidden name="periode_id" value={periodeId} />
                <HapusButton
                  pesan={`Hapus seksi ${seksi.nama}? Semua orang di dalamnya ikut terhapus.`}
                  className={btnDanger}
                >
                  Hapus seksi
                </HapusButton>
              </form>
            </div>
          </Modal>
        )}
      </div>

      {seksi.pengurus.length === 0 ? (
        <p className="py-2 text-xs text-[#FBF6E6]/35">Belum ada anggota.</p>
      ) : (
        <SortableList
          disabled={!isAdmin}
          onReorder={urutkanPengurus.bind(null, seksi.id)}
          className="mt-2 space-y-2"
          itemClassName="flex items-center gap-1 rounded-2xl border border-[#FBF6E6]/10 bg-black/20 pr-4 transition-colors hover:border-[#FFD21F]/30"
          items={seksi.pengurus.map((orang) => ({
            id: orang.id,
            content: isAdmin ? (
              <Modal
                title="Edit orang"
                trigger={<OrangSummary orang={orang} />}
                triggerClassName="block w-full py-3 pl-2 text-left"
              >
                <div className="space-y-5">
                  <form action={ubahPengurus} className="space-y-4">
                    <Hidden name="id" value={orang.id} />
                    <Hidden name="periode_id" value={periodeId} />
                    <PengurusFields orang={orang} />
                    <button type="submit" className={btnPrimary}>
                      Simpan perubahan
                    </button>
                  </form>

                  <form
                    action={hapusPengurus}
                    className="border-t border-[#FBF6E6]/10 pt-4"
                  >
                    <Hidden name="id" value={orang.id} />
                    <Hidden name="periode_id" value={periodeId} />
                    <HapusButton
                      pesan={`Hapus ${orang.nama} dari ${seksi.nama}?`}
                      className={btnDanger}
                    >
                      Hapus
                    </HapusButton>
                  </form>
                </div>
              </Modal>
            ) : (
              <div className="py-3 pl-4">
                <OrangSummary orang={orang} />
              </div>
            ),
          }))}
        />
      )}

      {isAdmin && (
        <div className="mt-3">
          <Modal
            title={`Tambah orang di ${seksi.nama}`}
            trigger="+ Tambah orang"
            triggerClassName={btnLink}
          >
            <form action={tambahPengurus} className="space-y-4">
              <Hidden name="seksi_id" value={seksi.id} />
              <Hidden name="periode_id" value={periodeId} />
              <PengurusFields />
              <button type="submit" className={btnPrimary}>
                Simpan
              </button>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
}

/* ---------- halaman ---------- */

async function AdminStrukturContent({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string; error?: string }>;
}) {
  await connection();

  const { periode: periodeParam, error: errorParam } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  const { data: periodeList, error: periodeError } = await supabase
    .from("periode")
    .select("id, nama, aktif, urutan, seksi(count)")
    .order("urutan", { ascending: true })
    .order("nama", { ascending: false });

  const daftarPeriode = (periodeList ?? []) as PeriodeRow[];
  const terpilih = periodeParam
    ? (daftarPeriode.find((p) => p.id === periodeParam) ?? null)
    : null;

  let daftarSeksi: Seksi[] = [];
  let seksiError: string | null = null;

  if (terpilih) {
    const { data, error } = await supabase
      .from("seksi")
      .select(
        "id, nama, deskripsi, urutan, pengurus(id, nama, jabatan, peran, urutan)"
      )
      .eq("periode_id", terpilih.id)
      .order("urutan", { ascending: true })
      .order("urutan", { referencedTable: "pengurus", ascending: true });

    if (error) seksiError = error.message;
    daftarSeksi = (data ?? []) as Seksi[];
  }

  const errorMessage = errorParam ?? periodeError?.message ?? seksiError;

  return (
    <div className="min-h-screen bg-black/25">
      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
        {errorMessage && (
          <p
            role="alert"
            className="mb-5 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {errorMessage}
          </p>
        )}

        {!isAdmin && (
          <p
            role="alert"
            className="mb-5 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            Akun ini belum berstatus admin, jadi belum bisa mengubah struktur.
            Ubah kolom <code>role</code> di tabel <code>profiles</code> menjadi{" "}
            <code>admin</code>.
          </p>
        )}

        {!terpilih ? (
          /* ================= DAFTAR FOLDER PERIODE ================= */
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                  Struktur <span className="text-[#FFD21F]">organisasi.</span>
                </h1>
                <p className="mt-1 text-sm text-[#FBF6E6]/55">
                  Pilih folder periode untuk melihat susunan pengurusnya.
                </p>
              </div>

              {isAdmin && (
                <Modal
                  title="Periode baru"
                  trigger="+ Periode baru"
                  triggerClassName={`${btnPrimary} mt-1`}
                >
                  <form action={tambahPeriode} className="space-y-4">
                    <Field label="Nama periode">
                      <input
                        name="nama"
                        required
                        placeholder="Contoh: 2026/2027"
                        className={inputCls}
                      />
                    </Field>
                    <label className="flex items-center gap-2 text-xs text-[#FBF6E6]/70">
                      <input type="checkbox" name="aktif" />
                      Jadikan periode aktif
                    </label>
                    <button type="submit" className={btnPrimary}>
                      Buat folder
                    </button>
                  </form>
                </Modal>
              )}
            </div>

            {daftarPeriode.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-[#FBF6E6]/10 p-6 text-sm text-[#FBF6E6]/50">
                Belum ada periode.
              </p>
            ) : (
              <SortableList
                layout="grid"
                numbered
                disabled={!isAdmin}
                onReorder={urutkanPeriode}
                className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
                itemClassName="group relative rounded-2xl border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.025] transition-colors hover:border-[#FFD21F]/40 hover:bg-[#FFD21F]/[0.04]"
                items={daftarPeriode.map((p) => ({
                  id: p.id,
                  content: (
                    <Link
                      href={`/admin/struktur?periode=${p.id}`}
                      className="flex flex-col items-center px-3 py-5 text-center"
                    >
                      <Folder aktif={p.aktif} />
                      <p className="mt-3 text-sm font-bold">{p.nama}</p>
                      <p className="mt-1 text-xs text-[#FBF6E6]/40">
                        {p.seksi[0]?.count ?? 0} seksi
                      </p>
                      {p.aktif && (
                        <span className="mt-2 rounded-full border border-[#FFD21F]/25 bg-[#FFD21F]/[0.07] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FFD21F]">
                          Aktif
                        </span>
                      )}
                    </Link>
                  ),
                }))}
              />
            )}
          </>
        ) : (
          /* ================= ISI SATU PERIODE ================= */
          <>
            <Link
              href="/admin/struktur"
              className="text-xs font-semibold text-[#FBF6E6]/45 transition-colors hover:text-[#FFD21F]"
            >
              ← Semua periode
            </Link>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                  {terpilih.nama}
                </h1>
                {terpilih.aktif && (
                  <span className="rounded-full border border-[#FFD21F]/25 bg-[#FFD21F]/[0.07] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FFD21F]">
                    Aktif
                  </span>
                )}
              </div>

              {isAdmin && (
                <div className="mt-1 flex shrink-0 gap-2">
                  <Modal
                    title="Pengaturan periode"
                    trigger="Pengaturan"
                    triggerClassName={btnGhost}
                  >
                    <div className="space-y-5">
                      <form action={ubahPeriode} className="space-y-4">
                        <Hidden name="id" value={terpilih.id} />
                        <Field label="Nama periode">
                          <input
                            name="nama"
                            required
                            defaultValue={terpilih.nama}
                            className={inputCls}
                          />
                        </Field>
                        <button type="submit" className={btnPrimary}>
                          Simpan perubahan
                        </button>
                      </form>

                      <div className="flex flex-wrap gap-2 border-t border-[#FBF6E6]/10 pt-4">
                        {!terpilih.aktif && (
                          <form action={aktifkanPeriode}>
                            <Hidden name="id" value={terpilih.id} />
                            <button type="submit" className={btnGhost}>
                              Jadikan aktif
                            </button>
                          </form>
                        )}

                        <form action={hapusPeriode}>
                          <Hidden name="id" value={terpilih.id} />
                          <HapusButton
                            pesan={`Hapus periode ${terpilih.nama}? Semua seksi dan pengurus di dalamnya ikut terhapus.`}
                            className={btnDanger}
                          >
                            Hapus periode
                          </HapusButton>
                        </form>
                      </div>
                    </div>
                  </Modal>

                  <Modal
                    title="Tambah seksi"
                    trigger="+ Tambah seksi"
                    triggerClassName={btnPrimary}
                  >
                    <form action={tambahSeksi} className="space-y-4">
                      <Hidden name="periode_id" value={terpilih.id} />
                      <SeksiFields />
                      <button type="submit" className={btnPrimary}>
                        Simpan seksi
                      </button>
                    </form>
                  </Modal>
                </div>
              )}
            </div>

            {daftarSeksi.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-[#FBF6E6]/10 p-6 text-sm text-[#FBF6E6]/50">
                Periode ini belum punya seksi.
              </p>
            ) : (
              <SortableList
                disabled={!isAdmin}
                onReorder={urutkanSeksi.bind(null, terpilih.id)}
                className="mt-8 space-y-4"
                itemClassName="flex items-start gap-1 rounded-[1.5rem] border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.03] px-2 pb-4 pt-3 sm:px-3"
                items={daftarSeksi.map((seksi) => ({
                  id: seksi.id,
                  content: (
                    <SeksiBlock
                      seksi={seksi}
                      periodeId={terpilih.id}
                      isAdmin={isAdmin}
                    />
                  ),
                }))}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminStruktur({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string; error?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
          <p role="status" className="text-sm text-[#FBF6E6]/50">
            Memuat struktur...
          </p>
        </div>
      }
    >
      <AdminStrukturContent searchParams={searchParams} />
    </Suspense>
  );
}