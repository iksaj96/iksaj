"use client";

export const MB = 1024 * 1024;
/** Total penyimpanan paket Supabase gratis (1 GB). Ubah jika paket naik. */
export const PLAN_TOTAL = 1024 * MB;

export type BucketUsage = Record<string, { files: number; bytes: number }>;

/** Jatah aman per kategori. `bucket` harus sama dengan nama bucket di Supabase. */
const CATS = [
  { key: "drive", label: "IKSAJ Drive", bucket: "drive", quota: 300 * MB, color: "#FFD21F" },
  { key: "galeri", label: "Galeri", bucket: "galeri", quota: 350 * MB, color: "#F97316" },
  { key: "karya", label: "Karya Tulis", bucket: "karya", quota: 100 * MB, color: "#FBF6E6" },
  { key: "berita", label: "Berita", bucket: "berita", quota: 50 * MB, color: "#22A06B" },
] as const;

export const DRIVE_QUOTA = CATS[0].quota;

function fmt(b: number) {
  if (b <= 0) return "0 B";
  if (b < 1024) return `${b} B`;
  const units = ["KB", "MB", "GB"];
  let v = b / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2)} ${units[i]}`;
}

const R = 52;
const C = 2 * Math.PI * R;

export default function StorageDiagram({
  driveBytes,
  driveFiles,
  usage,
  usageError,
  onRefresh,
}: {
  driveBytes: number;
  driveFiles: number;
  usage: BucketUsage;
  usageError: boolean;
  onRefresh: () => void;
}) {
  const rows = CATS.map((c) => {
    const u =
      c.key === "drive"
        ? { files: driveFiles, bytes: driveBytes }
        : (usage[c.bucket] ?? { files: 0, bytes: 0 });
    return { ...c, ...u, pct: Math.min(100, (u.bytes / c.quota) * 100) };
  });

  const known = new Set<string>(CATS.map((c) => c.bucket));
  const other = Object.entries(usage)
    .filter(([k]) => !known.has(k))
    .reduce((s, [, v]) => s + v.bytes, 0);

  const used = rows.reduce((s, r) => s + r.bytes, 0) + other;
  const planPct = Math.min(100, (used / PLAN_TOTAL) * 100);
  const allocated = CATS.reduce((s, c) => s + c.quota, 0);
  const reserve = PLAN_TOTAL - allocated;

  const status =
    planPct < 50
      ? { text: "Aman", cls: "bg-[#22A06B]/20 text-[#5BE3A4]" }
      : planPct < 75
        ? { text: "Waspada", cls: "bg-[#FFD21F]/20 text-[#FFD21F]" }
        : { text: "Hampir penuh", cls: "bg-red-400/20 text-red-300" };

  // segmen cincin
  const segs = [
    ...rows.map((r) => ({ key: r.key, color: r.color, bytes: r.bytes })),
    { key: "other", color: "#78716C", bytes: other },
  ].filter((s) => s.bytes > 0);

  let offset = 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pb-1 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FBF6E6]/40">
          Penyimpanan
        </p>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-[#FBF6E6]/50 transition-colors hover:bg-[#FFD21F]/10 hover:text-[#FFD21F]"
        >
          Segarkan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* cincin */}
        <div className="relative mx-auto mt-2 h-40 w-40">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img"
            aria-label={`Terpakai ${fmt(used)} dari ${fmt(PLAN_TOTAL)}`}>
            <circle cx="60" cy="60" r={R} fill="none" stroke="#FBF6E6" strokeOpacity="0.1" strokeWidth="12" />
            {segs.map((s) => {
              const len = Math.max((s.bytes / PLAN_TOTAL) * C, 1.5);
              const el = (
                <circle
                  key={s.key}
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="12"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold leading-none">
                {planPct < 10 ? planPct.toFixed(1) : Math.round(planPct)}
                <span className="text-base text-[#FFD21F]">%</span>
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#FBF6E6]/50">
                terpakai
              </p>
            </div>
          </div>
        </div>

        <p className="mt-2 text-center text-sm font-bold">
          {fmt(used)} <span className="font-normal text-[#FBF6E6]/50">dari {fmt(PLAN_TOTAL)}</span>
        </p>
        <p className="mt-1.5 text-center">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${status.cls}`}>
            {status.text}
          </span>
        </p>

        {/* rincian per kategori */}
        <ul className="mt-5 space-y-3.5">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: r.color }} />
                <span className="flex-1 truncate font-semibold">{r.label}</span>
                <span className="text-[#FBF6E6]/60">
                  {fmt(r.bytes)} / {fmt(r.quota)}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#FBF6E6]/10">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${r.bytes > 0 ? Math.max(r.pct, 2) : 0}%`,
                    background: r.pct >= 90 ? "#F87171" : r.color,
                  }}
                />
              </div>
              <p className="mt-1 text-[10px] text-[#FBF6E6]/40">
                {r.files} berkas · {r.pct < 10 ? r.pct.toFixed(1) : Math.round(r.pct)}% dari jatah
              </p>
            </li>
          ))}

          {other > 0 && (
            <li className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#78716C]" />
              <span className="flex-1 font-semibold">Lainnya</span>
              <span className="text-[#FBF6E6]/60">{fmt(other)}</span>
            </li>
          )}

          {/* cadangan */}
          <li className="rounded-xl border border-dashed border-[#FFD21F]/40 px-3 py-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Cadangan kosong</span>
              <span className="font-bold text-[#FFD21F]">{fmt(reserve)}</span>
            </div>
            <p className="mt-1 text-[10px] leading-snug text-[#FBF6E6]/40">
              Tidak dijatah ke siapa pun, disimpan agar ruang tetap lega.
            </p>
          </li>
        </ul>

        {usageError && (
          <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-[11px] leading-snug text-red-300">
            Data Galeri, Karya, dan Berita belum terbaca. Jalankan SQL fungsi
            storage_usage() di Supabase.
          </p>
        )}

        <p className="mt-4 text-[10px] leading-relaxed text-[#FBF6E6]/35">
          Paket gratis Supabase: 1 GB penyimpanan berkas. Teks berita disimpan
          di database (terpisah, 500 MB) sehingga tidak dihitung di sini.
        </p>
      </div>
    </div>
  );
}