"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StorageDiagram, {
  type BucketUsage,
  type DbUsage,
} from "./StorageDiagram";

const PAGE_SIZE = 1000;

type DriveUsage = {
  bytes: number;
  files: number;
};

type StorageSnapshot = {
  drive: DriveUsage;
  usage: BucketUsage;
  usageError: boolean;
  db: DbUsage | null;
  dbError: boolean;
  dbErrorMessage: string | null; // DEBUG
};

type LoadResult =
  | { snapshot: StorageSnapshot; error: null }
  | { snapshot: null; error: string };

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Terjadi kesalahan saat memuat data penyimpanan.";
}

export default function DashboardStorage() {
  const supabase = useMemo(() => createClient(), []);
  const [snapshot, setSnapshot] = useState<StorageSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
                total.files += 1;
              }
              return total;
            },
            { bytes: 0, files: 0 }
          );
        })(),
        supabase.rpc("storage_usage"),
        supabase.rpc("get_db_size"),
      ]);

      // DEBUG: hapus dua baris ini kalau sudah beres
      if (dbResult.error) console.error("get_db_size gagal:", dbResult.error);
      else console.log("get_db_size hasil:", dbResult.data);

      const usage: BucketUsage = {};
      if (!usageResult.error) {
        for (const row of (usageResult.data ?? []) as {
          bucket_id: string;
          files: number | string;
          bytes: number | string;
        }[]) {
          usage[row.bucket_id] = {
            files: Number(row.files),
            bytes: Number(row.bytes),
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
            .map(([name, bytes]) => ({ name, bytes: Number(bytes) || 0 }))
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
          dbErrorMessage: dbResult.error
            ? `${dbResult.error.code ?? ""} ${dbResult.error.message}`.trim()
            : null,
        },
        error: null,
      };
    } catch (loadError) {
      return { snapshot: null, error: getErrorMessage(loadError) };
    }
  }, [supabase]);

  const refresh = useCallback(async () => {
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

  return (
    <section
      aria-label="Penggunaan penyimpanan"
      className="h-full overflow-hidden rounded-3xl border border-[#FFD21F]/20 bg-[#14110a]/70"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#FBF6E6]/10 px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFD21F]">
            Ruang penyimpanan
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-extrabold">
            Pantau kapasitas
          </h2>
        </div>
        {(!snapshot || error) && (
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="shrink-0 rounded-full border border-[#FBF6E6]/20 px-3 py-1.5 text-xs font-semibold text-[#FBF6E6]/70 transition-colors hover:border-[#FFD21F]/50 hover:text-[#FFD21F] disabled:opacity-40"
          >
            {loading ? "Memuat…" : "Coba lagi"}
          </button>
        )}
      </div>

      {loading && !snapshot && (
        <p role="status" className="px-5 py-8 text-center text-sm text-[#FBF6E6]/55">
          Memuat data penyimpanan…
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mx-4 mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs leading-relaxed text-red-300"
        >
          Data penyimpanan Drive gagal dimuat: {error}
        </p>
      )}

      {/* DEBUG: tampilkan error asli get_db_size. Hapus blok ini kalau sudah beres */}
      {snapshot?.dbErrorMessage && (
        <p className="mx-4 mt-4 break-words rounded-xl border border-[#FFD21F]/40 bg-[#FFD21F]/10 px-3 py-2 font-mono text-[11px] leading-relaxed text-[#FFD21F]">
          DEBUG get_db_size: {snapshot.dbErrorMessage}
        </p>
      )}

      {snapshot && (
        <StorageDiagram
          driveBytes={snapshot.drive.bytes}
          driveFiles={snapshot.drive.files}
          usage={snapshot.usage}
          usageError={snapshot.usageError}
          db={snapshot.db}
          dbError={snapshot.dbError}
          onRefresh={() => void refresh()}
        />
      )}
    </section>
  );
}