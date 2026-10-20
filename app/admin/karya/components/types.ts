export type Karya = {
  id: string;
  title: string;
  author: string;
  category: string;
  content: string;
  cover_path: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type KaryaInput = {
  title: string;
  author: string;
  category: string;
  content: string;
  published: boolean;
};