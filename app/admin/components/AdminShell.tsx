"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // halaman login tampil penuh, tanpa sidebar
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="relative min-h-screen lg:pl-64">
      {/* background gambar (hanya area konten, tidak menutupi sidebar) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat lg:left-64"
      >
        {/* lapisan gelap supaya teks tetap terbaca */}
        <div className="absolute inset-0 bg-[#14110a]/70" />
      </div>

      <Sidebar />
      <main className="relative z-10 min-h-screen pt-14 lg:pt-0">{children}</main>
    </div>
  );
}