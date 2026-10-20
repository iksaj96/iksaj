import type { DragEvent } from "react";

export type Item = {
  id: string;
  parent_id: string | null;
  name: string;
  is_folder: boolean;
  storage_path: string | null;
  mime_type: string | null;
  size: number | null;
  created_at: string;
  updated_at: string;
};

export type SortKey = "name" | "updated_at" | "type" | "size";
export type ViewMode = "details" | "icons";

export type DropHandlers = {
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>) => void;
};