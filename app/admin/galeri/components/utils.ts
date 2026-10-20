export const BUCKET = "galeri";
export const TABLE = "galeri";
export const MB = 1024 * 1024;
/** Jatah Galeri. Samakan dengan CATS di StorageDiagram. */
export const GALERI_QUOTA = 350 * MB;
export const MAX_INPUT = 50 * MB; // batas berkas asli
export const MAX_DIM = 1920; // sisi terpanjang setelah dikecilkan
export const COLS =
  "id,title,caption,storage_path,mime_type,size,width,height,created_at,updated_at";
export const PAGE = 1000;

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
    month: "long",
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

export function baseName(name: string) {
  const i = name.lastIndexOf(".");
  return (i > 0 ? name.slice(0, i) : name).trim() || "Foto";
}

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
}

export type Prepared = {
  blob: Blob;
  ext: string;
  type: string;
  width: number | null;
  height: number | null;
};

/**
 * Kecilkan foto (maks. 1920 px) dan ubah ke WebP agar hemat kuota.
 * Jika hasilnya tidak lebih kecil, berkas asli dipakai.
 * GIF / format lain dipakai apa adanya.
 */
export async function prepareImage(file: File): Promise<Prepared> {
  const original: Prepared = {
    blob: file,
    ext: extOf(file.name) || "jpg",
    type: file.type || "application/octet-stream",
    width: null,
    height: null,
  };
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return original;

  try {
    const bmp = await createImageBitmap(file);
    const srcW = bmp.width;
    const srcH = bmp.height;
    const scale = Math.min(1, MAX_DIM / Math.max(srcW, srcH));
    const w = Math.max(1, Math.round(srcW * scale));
    const h = Math.max(1, Math.round(srcH * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bmp.close();
      return { ...original, width: srcW, height: srcH };
    }
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/webp", 0.82)
    );
    if (blob && blob.size < file.size) {
      return { blob, ext: "webp", type: "image/webp", width: w, height: h };
    }
    return { ...original, width: srcW, height: srcH };
  } catch {
    return original;
  }
}