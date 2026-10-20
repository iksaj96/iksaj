export type Photo = {
  id: string;
  title: string;
  caption: string | null;
  storage_path: string;
  mime_type: string | null;
  size: number;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
};