import { createClient } from "@/lib/supabase/server";

export type Berita = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  cover_path: string | null;
  created_at: string;
};

export type Karya = {
  id: string;
  title: string;
  author: string;
  category: string;
};

export type Galeri = {
  id: string;
  title: string;
  caption: string | null;
  storage_path: string;
};

// Ganti nama bucket sesuai Supabase Storage kamu (bucket harus public)
export const BUCKET = {
  berita: "berita",
  karya: "karya",
  galeri: "galeri",
} as const;

export function publicUrl(bucket: string, path: string | null) {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function getLandingData() {
  const supabase = await createClient();

  const [berita, karya, galeri] = await Promise.all([
    supabase
      .from("berita")
      .select("id, slug, title, summary, category, cover_path, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("karya")
      .select("id, title, author, category")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("galeri")
      .select("id, title, caption, storage_path")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (berita.error) console.error("berita:", berita.error.message);
  if (karya.error) console.error("karya:", karya.error.message);
  if (galeri.error) console.error("galeri:", galeri.error.message);

  return {
    berita: (berita.data ?? []) as Berita[],
    karya: (karya.data ?? []) as Karya[],
    galeri: (galeri.data ?? []) as Galeri[],
  };
}