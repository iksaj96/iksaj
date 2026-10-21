
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const PAGE_SIZE = 1000;
const MB = 1024 * 1024;
const PLAN_TOTAL = 1024 * MB;
const DB_QUOTA = 500 * MB;

const COLORS = {
  yellow: "#FFD21F",
  cream: "#FBF6E6",
  orange: "#F97316",
  green: "#22A06B",
  blue: "#38BDF8",
  red: "#F87171",
  muted: "#78716C",
};

const CATS = [
  {
    key: "drive",
    label: "IKSAJ Drive",
    bucket: "drive",
    quota: 300 * MB,
    color: COLORS.yellow,
  },
  {
    key: "galeri",
    label: "Galeri",
    bucket: "galeri",
    quota: 350 * MB,
    color: COLORS.orange,
  },
  {
    key: "karya",
    label: "Karya Tulis",
    bucket: "karya",
    quota: 100 * MB,
    color: COLORS.cream,
  },
  {
    key: "berita",
    label: "Berita",
    bucket: "berita",
    quota: 50 * MB,
    color: COLORS.green,
  },
] as const;

type BucketUsage = Record<string, { files: number; bytes: number }>;

type DbUsage = {
  total: number;
  tables: { name: string; bytes: number }[];
};

type DriveUsage = {
  bytes: number;
  files: number;
};

type Snapshot = {
  drive: DriveUsage;
  usage: BucketUsage;
  usageError: boolean;
  db: DbUsage | null;
  dbError: boolean;
};

type LoadResult =
  | { snapshot: Snapshot; error: null }
  | { snapshot: null; error: string };

type ModalType = "storage" | "database" | null;

function fmt(bytes: number) {
  if (bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }

  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[index]}`;
}

function percentage(bytes: number, quota: number) {
  return quota > 0 ? Math.max(0, (bytes / quota) * 100) : 0;
}

function displayPercentage(value: number) {
  return value < 10 ? value.toFixed(1) : Math.round(value).toString();
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Terjadi kesalahan saat memuat data.";
}

function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: "arrow" | "refresh" | "close" | "database" | "storage" | "file";
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      {...common}
    >
      {name === "arrow" && (
        <>
          <path d="M7 17 17 7M7 7h10v10" />
        </>
      )}
      {name === "refresh" && (
        <>
          <path d="M20 7v5h-5" />
          <path d="M4.9 9a7.5 7.5 0 0 1 12.4-3L20 12M4 17v-5h5" />
          <path d="M19.1 15a7.5 7.5 0 0 1-12.4 3L4 12" />
        </>
      )}
      {name === "close" && <path d="m18 6-12 12M6 6l12 12" />}
      {name === "database" && (
        <>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </>
      )}
      {name === "storage" && (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 7h.01M11 7h.01M7 15h4M7 17h7" />
        </>
      )}
      {name === "file" && (
        <>
          <path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Z" />
          <path d="M13 3v7h7M8 14h8M8 17h8" />
        </>
      )}
    </svg>
  );
}

/** Diagram donat SVG untuk kapasitas terpakai. */
function CapacityRing({
  used,
  quota,
  color,
  label,
}: {
  used: number;
  quota: number;
  color: string;
  label: string;
}) {
  const radius = 43;
  const circumference = 2 * Math.PI * radius;
  const pct = percentage(used, quota);
  const visiblePct = Math.min(pct, 100);
  const dash = (visiblePct / 100) * circumference;

  return (
    <svg
      viewBox="0 0 112 112"
      role="img"
      aria-label={`${label}: ${fmt(used)} dari ${fmt(quota)}, ${displayPercentage(pct)} persen terpakai`}
      className="h-[104px] w-[104px] shrink-0 overflow-visible"
    >
      <circle
        cx="56"
        cy="56"
        r={radius}
        fill="none"
        stroke={COLORS.cream}
        strokeOpacity="0.09"
        strokeWidth="9"
      />

      <circle
        className="capacity-ring-progress"
        cx="56"
        cy="56"
        r={radius}
        fill="none"
        stroke={pct >= 90 ? COLORS.red : color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform="rotate(-90 56 56)"
      />

      <text
        x="56"
        y="54"
        textAnchor="middle"
        fill={COLORS.cream}
        fontSize="20"
        fontWeight="800"
      >
        {displayPercentage(pct)}
        <tspan fontSize="10" fill={color}>
          %
        </tspan>
      </text>

      <text
        x="56"
        y="69"
        textAnchor="middle"
        fill={COLORS.cream}
        fillOpacity="0.5"
        fontSize="8"
      >
        TERPAKAI
      </text>
    </svg>
  );
}

function getStatus(pct: number) {
  if (pct >= 90) {
    return {
      label: "Hampir penuh",
      color: COLORS.red,
      background: "bg-red-400/10",
    };
  }

  if (pct >= 75) {
    return {
      label: "Waspada",
      color: COLORS.yellow,
      background: "bg-[#FFD21F]/10",
    };
  }

  return {
    label: "Aman",
    color: "#5BE3A4",
    background: "bg-[#22A06B]/10",
  };
}

function ProgressBar({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  return (
    <div
      className="h-1.5 overflow-hidden rounded-sm bg-[#FBF6E6]/[0.08]"
      role="progressbar"
      aria-valuenow={Math.round(Math.min(value, 100))}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="capacity-bar-fill h-full rounded-sm transition-[width] duration-700 ease-out"
        style={{
          width: `${Math.min(value, 100)}%`,
          background: value >= 90 ? COLORS.red : color,
        }}
      />
    </div>
  );
}

export default function DashboardStorage() {
  const supabase = useMemo(() => createClient(), []);

  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);

  const loadSnapshot = useCallback(async (): Promise<LoadResult> => {
    try {
      const [drive, usageResult, dbResult] = await Promise.all([
        (async () => {
          const files: { is_folder: boolean; size: number | null }[] = [];

          for (let from = 0; ; from += PAGE_SIZE) {
            const { data, error: driveError } = await supabase
              .from("drive_items")
              .select("is_folder,size")
              .order("id", { ascending: true })
              .range(from, from + PAGE_SIZE - 1);

            if (driveError) throw driveError;

            files.push(...(data ?? []));

            if (!data || data.length < PAGE_SIZE) break;
          }

          return files.reduce(
            (total, file) => {
              if (!file.is_folder) {
                total.bytes += Number(file.size) || 0;
                total.files++;
              }

              return total;
            },
            { bytes: 0, files: 0 },
          );
        })(),
        supabase.rpc("storage_usage"),
        supabase.rpc("get_db_size"),
      ]);

      const usage: BucketUsage = {};

      if (!usageResult.error) {
        for (const row of (usageResult.data ?? []) as {
          bucket_id: string;
          files: number | string;
          bytes: number | string;
        }[]) {
          usage[row.bucket_id] = {
            files: Number(row.files) || 0,
            bytes: Number(row.bytes) || 0,
          };
        }
      }

      let db: DbUsage | null = null;

      if (!dbResult.error && dbResult.data) {
        const raw = dbResult.data as {
          total: number | string;
          tables?: Record<string, number | string>;
        };

        db = {
          total: Number(raw.total) || 0,
          tables: Object.entries(raw.tables ?? {})
            .map(([name, bytes]) => ({
              name,
              bytes: Number(bytes) || 0,
            }))
            .sort((a, b) => b.bytes - a.bytes),
        };
      }

      return {
        snapshot: {
          drive,
          usage,
          usageError: !!usageResult.error,
          db,
          dbError: !!dbResult.error,
        },
        error: null,
      };
    } catch (loadError) {
      return { snapshot: null, error: getErrorMessage(loadError) };
    }
  }, [supabase]);

  const refresh = useCallback(async () => {
    setLoading(true);

    const result = await loadSnapshot();

    if (result.snapshot) setSnapshot(result.snapshot);
    setError(result.error);
    setLoading(false);
  }, [loadSnapshot]);

  useEffect(() => {
    let active = true;

    void loadSnapshot().then((result) => {
      if (!active) return;

      if (result.snapshot) setSnapshot(result.snapshot);
      setError(result.error);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [loadSnapshot]);

  useEffect(() => {
    if (!modal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(null);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal]);

  useEffect(() => {
    if (!modal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modal]);

  const rows = useMemo(() => {
    if (!snapshot) return [];

    return CATS.map((category) => {
      const usage =
        category.key === "drive"
          ? snapshot.drive
          : snapshot.usage[category.bucket] ?? {
              bytes: 0,
              files: 0,
            };

      return {
        ...category,
        bytes: usage.bytes,
        files: usage.files,
        pct: percentage(usage.bytes, category.quota),
      };
    });
  }, [snapshot]);

  const knownBuckets = useMemo(
    () => new Set<string>(CATS.map((category) => category.bucket)),
    [],
  );

  const otherBytes = useMemo(() => {
    if (!snapshot) return 0;

    return Object.entries(snapshot.usage)
      .filter(([bucket]) => !knownBuckets.has(bucket))
      .reduce((sum, [, item]) => sum + item.bytes, 0);
  }, [snapshot, knownBuckets]);

  const otherFiles = useMemo(() => {
    if (!snapshot) return 0;

    return Object.entries(snapshot.usage)
      .filter(([bucket]) => !knownBuckets.has(bucket))
      .reduce((sum, [, item]) => sum + item.files, 0);
  }, [snapshot, knownBuckets]);

  const used = rows.reduce((sum, row) => sum + row.bytes, 0) + otherBytes;
  const storagePct = percentage(used, PLAN_TOTAL);
  const db = snapshot?.db ?? null;
  const dbPct = db ? percentage(db.total, DB_QUOTA) : 0;

  const storageStatus = getStatus(storagePct);
  const dbStatus = getStatus(dbPct);

  const modalTitle =
    modal === "storage"
      ? "Detail penyimpanan"
      : modal === "database"
        ? "Detail database"
        : "";

  return (
    <>
      <section
        aria-label="Pantau kapasitas penyimpanan dan database"
        className="h-full min-w-0 overflow-hidden rounded-lg border border-[#FFD21F]/20 bg-[#14110a]/70"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#FBF6E6]/10 px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#FFD21F]/20 bg-[#FFD21F]/[0.07] text-[#FFD21F]">
              <Icon name="storage" className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFD21F]">
                IKSAJ · Monitoring
              </p>
              <h2 className="truncate text-sm font-extrabold text-[#FBF6E6]">
                Kapasitas sistem
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            aria-label="Segarkan data kapasitas"
            title="Segarkan data"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#FBF6E6]/10 text-[#FBF6E6]/60 transition hover:border-[#FFD21F]/40 hover:text-[#FFD21F] disabled:cursor-wait disabled:opacity-40"
          >
            <Icon
              name="refresh"
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {loading && !snapshot && (
          <div role="status" className="space-y-3 p-4">
            <div className="h-3 w-1/2 animate-pulse rounded-sm bg-[#FBF6E6]/10" />
            <div className="flex items-center gap-4">
              <div className="h-[104px] w-[104px] shrink-0 animate-pulse rounded-full bg-[#FBF6E6]/[0.05]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded-sm bg-[#FBF6E6]/10" />
                <div className="h-3 w-full animate-pulse rounded-sm bg-[#FBF6E6]/10" />
                <div className="h-3 w-2/3 animate-pulse rounded-sm bg-[#FBF6E6]/10" />
              </div>
            </div>
            <p className="text-[11px] text-[#FBF6E6]/40">
              Memuat kapasitas penyimpanan…
            </p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="m-3 rounded-md border border-red-400/30 bg-red-400/[0.07] p-3"
          >
            <p className="text-xs leading-relaxed text-red-300">
              Gagal memuat data Drive: {error}
            </p>

            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-2 text-xs font-bold text-[#FFD21F] hover:underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {snapshot && (
          <div className="grid gap-2.5 p-3 sm:grid-cols-2 sm:p-4">
            {/* Diagram penyimpanan */}
            <button
              type="button"
              onClick={() => setModal("storage")}
              aria-haspopup="dialog"
              className="group min-w-0 rounded-md border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.025] p-3 text-left transition duration-200 hover:border-[#FFD21F]/35 hover:bg-[#FFD21F]/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FBF6E6]/65">
                  <Icon name="storage" className="h-3.5 w-3.5 text-[#FFD21F]" />
                  <span className="truncate">Penyimpanan berkas</span>
                </span>

                <Icon
                  name="arrow"
                  className="h-3.5 w-3.5 shrink-0 text-[#FBF6E6]/30 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FFD21F]"
                />
              </div>

              <div className="mt-3 flex items-center gap-3">
                <CapacityRing
                  used={used}
                  quota={PLAN_TOTAL}
                  color={COLORS.yellow}
                  label="Penyimpanan berkas"
                />

                <div className="min-w-0 flex-1">
                  <p className="break-words text-lg font-extrabold leading-tight text-[#FBF6E6]">
                    {fmt(used)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#FBF6E6]/40">
                    dari {fmt(PLAN_TOTAL)}
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-sm px-1.5 py-1 text-[9px] font-bold ${storageStatus.background}`}
                    style={{ color: storageStatus.color }}
                  >
                    {storageStatus.label}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#FBF6E6]/[0.07] pt-2 text-[10px]">
                <span className="text-[#FBF6E6]/45">Sisa kapasitas</span>
                <span className="font-bold text-[#FBF6E6]/75">
                  {fmt(Math.max(0, PLAN_TOTAL - used))}
                </span>
              </div>

              <p className="mt-2 text-[10px] text-[#FFD21F]/70">
                Lihat rincian penyimpanan
              </p>
            </button>

            {/* Diagram database */}
            <button
              type="button"
              onClick={() => setModal("database")}
              aria-haspopup="dialog"
              className="group min-w-0 rounded-md border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.025] p-3 text-left transition duration-200 hover:border-sky-300/35 hover:bg-sky-300/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FBF6E6]/65">
                  <Icon name="database" className="h-3.5 w-3.5 text-sky-300" />
                  <span className="truncate">Database</span>
                </span>

                <Icon
                  name="arrow"
                  className="h-3.5 w-3.5 shrink-0 text-[#FBF6E6]/30 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-300"
                />
              </div>

              <div className="mt-3 flex items-center gap-3">
                {db ? (
                  <CapacityRing
                    used={db.total}
                    quota={DB_QUOTA}
                    color={COLORS.blue}
                    label="Database"
                  />
                ) : (
                  <div className="flex h-[104px] w-[104px] shrink-0 items-center justify-center">
                    <svg viewBox="0 0 112 112" className="h-full w-full">
                      <circle
                        cx="56"
                        cy="56"
                        r="43"
                        fill="none"
                        stroke={COLORS.cream}
                        strokeOpacity="0.09"
                        strokeWidth="9"
                      />
                      <Icon name="database" className="h-6 w-6 text-sky-300" />
                      <text
                        x="56"
                        y="82"
                        fill={COLORS.cream}
                        fillOpacity="0.5"
                        textAnchor="middle"
                        fontSize="8"
                      >
                        NO DATA
                      </text>
                    </svg>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {db ? (
                    <>
                      <p className="break-words text-lg font-extrabold leading-tight text-[#FBF6E6]">
                        {fmt(db.total)}
                      </p>
                      <p className="mt-1 text-[10px] text-[#FBF6E6]/40">
                        dari {fmt(DB_QUOTA)}
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-sm px-1.5 py-1 text-[9px] font-bold ${dbStatus.background}`}
                        style={{ color: dbStatus.color }}
                      >
                        {dbStatus.label}
                      </span>
                    </>
                  ) : (
                    <p className="text-xs leading-relaxed text-[#FBF6E6]/50">
                      Ukuran database belum tersedia.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#FBF6E6]/[0.07] pt-2 text-[10px]">
                <span className="text-[#FBF6E6]/45">Sisa kapasitas</span>
                <span className="font-bold text-[#FBF6E6]/75">
                  {db ? fmt(Math.max(0, DB_QUOTA - db.total)) : "—"}
                </span>
              </div>

              <p className="mt-2 text-[10px] text-sky-300/80">
                Lihat rincian database
              </p>
            </button>
          </div>
        )}

        {snapshot && (snapshot.usageError || snapshot.dbError) && (
          <div className="mx-3 mb-3 rounded-md border border-amber-300/20 bg-amber-300/[0.04] px-3 py-2.5 sm:mx-4">
            <p className="text-[10px] leading-relaxed text-amber-200/80">
              {snapshot.usageError &&
                "Sebagian data bucket belum tersedia. "}
              {snapshot.dbError &&
                "Data database belum berhasil dibaca. Periksa fungsi get_db_size() di Supabase."}
            </p>
          </div>
        )}

        {snapshot && (
          <div className="flex items-center justify-between gap-2 border-t border-[#FBF6E6]/10 px-3 py-2 sm:px-4">
            <span className="text-[9px] text-[#FBF6E6]/35">
              {loading ? "Memperbarui data…" : "Klik diagram untuk melihat detail"}
            </span>

            <span className="flex shrink-0 items-center gap-1.5 text-[9px] text-[#FBF6E6]/40">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  loading ? "animate-pulse bg-[#FFD21F]" : "bg-[#22A06B]"
                }`}
              />
              {loading ? "Memuat" : "Monitoring"}
            </span>
          </div>
        )}
      </section>

      {/* Modal detail */}
      {modal && snapshot && (
        <div
          className="storage-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-3 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="storage-modal-title"
            className="storage-modal-panel my-auto max-h-[90dvh] w-full max-w-lg overflow-hidden rounded-lg border border-[#FFD21F]/20 bg-[#17140d] shadow-2xl"
          >
            <header className="flex items-center justify-between gap-3 border-b border-[#FBF6E6]/10 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${
                    modal === "storage"
                      ? "border-[#FFD21F]/20 bg-[#FFD21F]/[0.07] text-[#FFD21F]"
                      : "border-sky-300/20 bg-sky-300/[0.07] text-sky-300"
                  }`}
                >
                  <Icon
                    name={modal === "storage" ? "storage" : "database"}
                    className="h-4 w-4"
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FBF6E6]/40">
                    Statistik IKSAJ
                  </p>
                  <h2
                    id="storage-modal-title"
                    className="truncate text-sm font-extrabold text-[#FBF6E6] sm:text-base"
                  >
                    {modalTitle}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Tutup detail"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#FBF6E6]/10 text-[#FBF6E6]/60 transition hover:border-[#FBF6E6]/30 hover:text-[#FBF6E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F]"
              >
                <Icon name="close" />
              </button>
            </header>

            <div className="max-h-[calc(90dvh-60px)] overflow-y-auto p-4 sm:p-5">
              {modal === "storage" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-md border border-[#FFD21F]/15 bg-[#FFD21F]/[0.035] p-3">
                    <CapacityRing
                      used={used}
                      quota={PLAN_TOTAL}
                      color={COLORS.yellow}
                      label="Total penyimpanan"
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#FBF6E6]/45">
                        Total terpakai
                      </p>
                      <p className="mt-1 break-words text-xl font-extrabold text-[#FBF6E6]">
                        {fmt(used)}
                      </p>
                      <p className="mt-1 text-xs text-[#FBF6E6]/45">
                        dari {fmt(PLAN_TOTAL)}
                      </p>
                      <p className="mt-2 text-[10px] text-[#FFD21F]">
                        Sisa {fmt(Math.max(0, PLAN_TOTAL - used))}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xs font-extrabold text-[#FBF6E6]">
                      Rincian per kategori
                    </h3>
                    <span className="text-[10px] text-[#FBF6E6]/40">
                      {rows.reduce((sum, row) => sum + row.files, 0) +
                        otherFiles}{" "}
                      berkas
                    </span>
                  </div>

                  <div className="space-y-3">
                    {rows.map((row) => (
                      <div
                        key={row.key}
                        className="rounded-md border border-[#FBF6E6]/[0.08] p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-sm"
                              style={{ background: row.color }}
                            />
                            <span className="truncate text-xs font-bold text-[#FBF6E6]">
                              {row.label}
                            </span>
                          </div>

                          <span className="shrink-0 text-xs font-bold text-[#FBF6E6]/75">
                            {fmt(row.bytes)}
                          </span>
                        </div>

                        <div className="mt-2.5">
                          <ProgressBar value={row.pct} color={row.color} />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#FBF6E6]/45">
                          <span>{row.files} berkas</span>
                          <span>
                            {displayPercentage(row.pct)}% dari jatah{" "}
                            {fmt(row.quota)}
                          </span>
                        </div>
                      </div>
                    ))}

                    {otherBytes > 0 && (
                      <div className="rounded-md border border-[#FBF6E6]/[0.08] p-3">
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="flex items-center gap-2 font-bold">
                            <span className="h-2.5 w-2.5 rounded-sm bg-[#78716C]" />
                            Bucket lainnya
                          </span>
                          <span className="font-bold">{fmt(otherBytes)}</span>
                        </div>
                        <p className="mt-1.5 text-[10px] text-[#FBF6E6]/45">
                          {otherFiles} berkas di luar kategori utama.
                        </p>
                      </div>
                    )}

                    <div className="rounded-md border border-dashed border-[#FFD21F]/25 p-3">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="font-semibold text-[#FBF6E6]/70">
                          Cadangan di luar alokasi kategori
                        </span>
                        <span className="shrink-0 font-bold text-[#FFD21F]">
                          {fmt(
                            Math.max(
                              0,
                              PLAN_TOTAL -
                                CATS.reduce(
                                  (sum, category) => sum + category.quota,
                                  0,
                                ),
                            ),
                          )}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[10px] leading-relaxed text-[#FBF6E6]/40">
                        Selisih kuota paket dan alokasi kategori. Angka ini
                        bukan tambahan kuota di luar paket.
                      </p>
                    </div>
                  </div>

                  {snapshot.usageError && (
                    <p className="rounded-md border border-amber-300/20 bg-amber-300/[0.05] p-3 text-[11px] leading-relaxed text-amber-200/80">
                      Data sebagian bucket belum tersedia. Periksa fungsi
                      storage_usage() di Supabase. Angka kategori yang belum
                      terbaca mungkin belum lengkap.
                    </p>
                  )}

                  <p className="text-[10px] leading-relaxed text-[#FBF6E6]/35">
                    Batas 1 GB adalah nilai konfigurasi aplikasi. Pastikan
                    sesuai dengan paket penyimpanan Supabase yang aktif.
                  </p>
                </div>
              )}

              {modal === "database" && (
                <div className="space-y-4">
                  {db ? (
                    <>
                      <div className="flex items-center gap-4 rounded-md border border-sky-300/15 bg-sky-300/[0.035] p-3">
                        <CapacityRing
                          used={db.total}
                          quota={DB_QUOTA}
                          color={COLORS.blue}
                          label="Kapasitas database"
                        />

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#FBF6E6]/45">
                            Database terpakai
                          </p>
                          <p className="mt-1 break-words text-xl font-extrabold text-[#FBF6E6]">
                            {fmt(db.total)}
                          </p>
                          <p className="mt-1 text-xs text-[#FBF6E6]/45">
                            dari {fmt(DB_QUOTA)}
                          </p>
                          <p className="mt-2 text-[10px] text-sky-300">
                            Sisa {fmt(Math.max(0, DB_QUOTA - db.total))}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xs font-extrabold text-[#FBF6E6]">
                          Tabel terbesar
                        </h3>
                        <span className="text-[10px] text-[#FBF6E6]/40">
                          {db.tables.length} tabel terlapor
                        </span>
                      </div>

                      {db.tables.length > 0 ? (
                        <div className="space-y-2">
                          {db.tables.map((table, index) => (
                            <div
                              key={table.name}
                              className="rounded-md border border-[#FBF6E6]/[0.08] p-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-sky-300/[0.08] text-[10px] font-bold text-sky-300">
                                  {index + 1}
                                </span>
                                <span className="min-w-0 flex-1 break-all text-xs font-semibold text-[#FBF6E6]/80">
                                  {table.name}
                                </span>
                                <span className="shrink-0 text-xs font-bold text-[#FBF6E6]">
                                  {fmt(table.bytes)}
                                </span>
                              </div>

                              <div className="mt-2.5">
                                <ProgressBar
                                  value={
                                    db.total > 0
                                      ? (table.bytes / db.total) * 100
                                      : 0
                                  }
                                  color={COLORS.blue}
                                />
                              </div>

                              <p className="mt-1.5 text-right text-[10px] text-[#FBF6E6]/40">
                                {displayPercentage(
                                  db.total > 0
                                    ? (table.bytes / db.total) * 100
                                    : 0,
                                )}
                                % dari ukuran terlapor
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-md border border-[#FBF6E6]/10 p-3 text-xs text-[#FBF6E6]/45">
                          Fungsi database belum mengembalikan rincian tabel.
                        </p>
                      )}

                      <p className="text-[10px] leading-relaxed text-[#FBF6E6]/35">
                        Ukuran dan daftar tabel mengikuti hasil fungsi
                        get_db_size() di Supabase. Batas 500 MB merupakan
                        konfigurasi aplikasi dan perlu dicocokkan dengan paket
                        database aktif.
                      </p>
                    </>
                  ) : (
                    <div className="rounded-md border border-red-400/20 bg-red-400/[0.04] p-4">
                      <p className="text-sm font-bold text-red-200">
                        Data database belum tersedia
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-[#FBF6E6]/55">
                        Pastikan fungsi RPC get_db_size() tersedia, memiliki
                        izin eksekusi yang sesuai, dan mengembalikan ukuran
                        database beserta tabel jika diperlukan.
                      </p>
                      <button
                        type="button"
                        onClick={() => void refresh()}
                        disabled={loading}
                        className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#FFD21F] px-3 py-2 text-xs font-bold text-[#14110a] transition hover:bg-[#ffe36a] disabled:opacity-50"
                      >
                        <Icon name="refresh" className="h-3.5 w-3.5" />
                        {loading ? "Memuat…" : "Coba lagi"}
                      </button>
                    </div>
                  )}

                  {snapshot.dbError && (
                    <p className="rounded-md border border-amber-300/20 bg-amber-300/[0.05] p-3 text-[11px] leading-relaxed text-amber-200/80">
                      Pemanggilan get_db_size() gagal. Periksa fungsi SQL,
                      hak akses RPC, dan kebijakan keamanan Supabase.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 flex justify-end border-t border-[#FBF6E6]/10 pt-3">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-md border border-[#FBF6E6]/15 px-4 py-2 text-xs font-bold text-[#FBF6E6]/70 transition hover:border-[#FFD21F]/40 hover:text-[#FFD21F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F]"
                >
                  Tutup detail
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
