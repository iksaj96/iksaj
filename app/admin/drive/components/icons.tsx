import type { Item } from "./types";
import { extColor, extOf } from "./utils";

export const PATHS = {
  back: ["M15 5l-7 7 7 7"],
  forward: ["M9 5l7 7-7 7"],
  up: ["M12 19V5", "M6 11l6-6 6 6"],
  refresh: ["M20 12a8 8 0 1 1-2.5-5.8", "M20 4v5h-5"],
  upload: ["M12 16V5", "M7 10l5-5 5 5", "M5 20h14"],
  download: ["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"],
  external: [
    "M14 4h6v6",
    "M20 4l-9 9",
    "M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  ],
  pen: ["M4 20l4-1 11-11a2.1 2.1 0 0 0-3-3L5 16l-1 4Z", "M14 7l3 3"],
  trash: [
    "M4 7h16",
    "M10 11v6M14 11v6",
    "M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12",
    "M9 7V4h6v3",
  ],
  folderPlus: [
    "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
    "M12 10.5v5M9.5 13h5",
  ],
  search: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z", "M20 20l-4-4"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  chevronRight: ["M9 5l7 7-7 7"],
  chevronDown: ["M5 9l7 7 7-7"],
  gridView: ["M4 4h7v7H4Z", "M13 4h7v7h-7Z", "M4 13h7v7H4Z", "M13 13h7v7h-7Z"],
  listView: ["M4 6h16", "M4 12h16", "M4 18h16"],
} as const;

export type IconName = keyof typeof PATHS;

export function Ico({
  name,
  className = "h-[18px] w-[18px]",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export function FolderIcon({ h = 32 }: { h?: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 52"
      width={(h * 64) / 52}
      height={h}
      className="shrink-0"
    >
      <path
        d="M4 8a4 4 0 0 1 4-4h14l6 6h28a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"
        fill="#E0A100"
      />
      <path
        d="M4 22a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V22Z"
        fill="#FFD21F"
      />
    </svg>
  );
}

export function FileIcon({ name, h = 32 }: { name: string; h?: number }) {
  const ext = extOf(name);
  const label = (ext || "file").slice(0, 4).toUpperCase();
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 60"
      width={h * 0.8}
      height={h}
      className="shrink-0"
    >
      <path
        d="M6 4a4 4 0 0 1 4-4h20l12 12v44a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V4Z"
        fill="#FBF6E6"
      />
      <path d="M30 0l12 12h-8a4 4 0 0 1-4-4V0Z" fill="#D8CFAF" />
      <rect x="6" y="34" width="36" height="15" fill={extColor(ext)} />
      <text
        x="24"
        y="45"
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill="#fff"
        fontFamily="sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}

export function ItemIcon({ it, h }: { it: Item; h: number }) {
  return it.is_folder ? <FolderIcon h={h} /> : <FileIcon name={it.name} h={h} />;
}