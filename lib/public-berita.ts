import { createClient } from "@/lib/supabase/server";

export type PublishedBerita = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  content: string;
  cover_path: string | null;
  created_at: string;
};

const PAGE_SIZE = 1000;
const BERITA_COLUMNS =
  "id,slug,title,summary,category,content,cover_path,created_at";

export async function getPublishedBerita() {
  const supabase = await createClient();
  const all: PublishedBerita[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("berita")
      .select(BERITA_COLUMNS)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      throw new Error("Gagal memuat berita yang dipublikasikan.", {
        cause: error,
      });
    }

    all.push(...((data ?? []) as PublishedBerita[]));
    if (!data || data.length < PAGE_SIZE) break;
  }

  return all;
}

export async function getPublishedBeritaBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("berita")
    .select(BERITA_COLUMNS)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error("Gagal memuat artikel berita.", { cause: error });
  }

  return data as PublishedBerita | null;
}

export function formatBeritaDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
