export type Berita = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  content: string;
  cover_path: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type BeritaInput = {
  title: string;
  summary: string;
  category: string;
  content: string;
  published: boolean;
};