export const BUCKET = "berita";
export const TABLE = "berita";
export const MB = 1024 * 1024;
export const MAX_COVER = 10 * MB; // batas berkas gambar asli
export const MAX_DIM = 1600; // sisi terpanjang setelah dikecilkan
export const COLS =
  "id,slug,title,summary,category,content,cover_path,published,created_at,updated_at";
export const PAGE = 1000;
export const CATEGORIES = ["Kegiatan", "Pengumuman", "Prestasi", "Lainnya"];

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function errMsg(e: unknown) {
  if (typeof e === "object" && e && "message" in e) {
    return String((e as { message: unknown }).message);
  }
  return "Terjadi kesalahan.";
}

export function excerpt(text: string, max = 140) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max).trimEnd() + "…" : t;
}

/** Slug unik: judul yang dirapikan + 6 karakter awal id. */
export function makeSlug(title: string, id: string) {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return `${base || "berita"}-${id.slice(0, 6)}`;
}

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
}

export type Prepared = { blob: Blob; ext: string; type: string };

/** Kecilkan gambar (maks. 1600 px) dan ubah ke WebP. Jika gagal / tidak lebih kecil, pakai berkas asli. */
export async function prepareCover(file: File): Promise<Prepared> {
  const original: Prepared = {
    blob: file,
    ext: extOf(file.name) || "jpg",
    type: file.type || "application/octet-stream",
  };
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return original;

  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bmp.close();
      return original;
    }
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/webp", 0.82)
    );
    if (blob && blob.size < file.size) {
      return { blob, ext: "webp", type: "image/webp" };
    }
    return original;
  } catch {
    return original;
  }
}