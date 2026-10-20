export const PATHS = {
  plus: ["M12 5v14", "M5 12h14"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  trash: [
    "M4 7h16",
    "M10 11v6M14 11v6",
    "M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12",
    "M9 7V4h6v3",
  ],
  pen: ["M4 20l4-1 11-11a2.1 2.1 0 0 0-3-3L5 16l-1 4Z", "M14 7l3 3"],
  search: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z", "M20 20l-4-4"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  image: [
    "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
    "M3 16l5-5 4 4 3-3 6 6",
    "M9 9.5h.01",
  ],
  eye: [
    "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z",
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  ],
  eyeOff: [
    "M3 3l18 18",
    "M10.6 6.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1",
    "M6.5 6.9A16.6 16.6 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.1-.9",
  ],
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