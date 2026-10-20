import { createClient } from "@/lib/supabase/server";

export type PublishedKarya = {
  id: string;
  title: string;
  author: string;
  category: string;
  content: string;
  cover_path: string | null;
  created_at: string;
};

export type GaleriPhoto = {
  id: string;
  title: string;
  caption: string | null;
  storage_path: string;
  created_at: string;
};

const PAGE_SIZE = 1000;

export async function getPublishedKarya() {
  const supabase = await createClient();
  const all: PublishedKarya[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("karya")
      .select("id,title,author,category,content,cover_path,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      throw new Error("Gagal memuat karya yang dipublikasikan.", {
        cause: error,
      });
    }

    all.push(...((data ?? []) as PublishedKarya[]));
    if (!data || data.length < PAGE_SIZE) break;
  }

  return all;
}

export async function getPublishedKaryaById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("karya")
    .select("id,title,author,category,content,cover_path,created_at")
    .eq("published", true)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Gagal memuat karya.", { cause: error });
  }

  return data as PublishedKarya | null;
}

export async function getGaleriPhotos() {
  const supabase = await createClient();
  const all: GaleriPhoto[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("galeri")
      .select("id,title,caption,storage_path,created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      throw new Error("Gagal memuat dokumentasi galeri.", { cause: error });
    }

    all.push(...((data ?? []) as GaleriPhoto[]));
    if (!data || data.length < PAGE_SIZE) break;
  }

  return all;
}
