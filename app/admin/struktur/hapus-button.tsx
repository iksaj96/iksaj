"use client";

export function HapusButton({
  pesan,
  className,
  children,
}: {
  pesan: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(pesan)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}