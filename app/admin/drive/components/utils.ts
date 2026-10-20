import type { Item } from "./types";

/* ---------- KONSTANTA ---------- */

export const BUCKET = "drive";
export const MAX_SIZE = 50 * 1024 * 1024; // 50 MB per berkas
export const COLS =
  "id,parent_id,name,is_folder,storage_path,mime_type,size,created_at,updated_at";
export const PAGE = 1000;
export const ROOT_NAME = "IKSAJ Drive";
export const DRAG_MIME = "application/x-iksaj-ids";
export const GRID =
  "grid-cols-[minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_9rem_8rem_5rem]";

/* ---------- FUNGSI BANTU ---------- */

export function formatSize(b?: number | null) {
  if (b == null) return "—";
  if (b < 1024) return `${b} B`;
  const units = ["KB", "MB", "GB"];
  let v = b / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 10 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function errMsg(e: unknown) {
  if (typeof e === "object" && e && "message" in e) {
    return String((e as { message: unknown }).message);
  }
  return "Terjadi kesalahan.";
}

export function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function typeLabel(it: Item) {
  if (it.is_folder) return "Folder";
  const ext = extOf(it.name);
  return ext ? `Berkas ${ext.toUpperCase()}` : "Berkas";
}

export function canPreview(mime: string | null) {
  if (!mime) return false;
  return (
    mime.startsWith("image/") ||
    mime.startsWith("video/") ||
    mime.startsWith("audio/") ||
    mime.startsWith("text/") ||
    mime === "application/pdf"
  );
}

export function extColor(ext: string) {
  if (ext === "pdf") return "#E5484D";
  if (["doc", "docx", "rtf", "txt", "odt"].includes(ext)) return "#3B82F6";
  if (["xls", "xlsx", "csv", "ods"].includes(ext)) return "#22A06B";
  if (["ppt", "pptx", "odp"].includes(ext)) return "#F97316";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext))
    return "#A855F7";
  if (["zip", "rar", "7z", "gz", "tar"].includes(ext)) return "#78716C";
  if (["mp3", "wav", "ogg", "mp4", "mkv", "mov", "webm"].includes(ext))
    return "#EC4899";
  return "#FFB000";
}

export function uniqueName(base: string, siblings: Item[]) {
  const used = new Set(siblings.map((s) => s.name.toLowerCase()));
  if (!used.has(base.toLowerCase())) return base;
  let n = 2;
  while (used.has(`${base} (${n})`.toLowerCase())) n++;
  return `${base} (${n})`;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const nameCmp = (a: Item, b: Item) =>
  a.name.localeCompare(b.name, "id", { numeric: true, sensitivity: "base" });