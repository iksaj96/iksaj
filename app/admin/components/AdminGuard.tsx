"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TAB_FLAG } from "@/lib/admin-tab";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLogin) return;

    let flag: string | null = null;
    try {
      flag = sessionStorage.getItem(TAB_FLAG);
    } catch {}

    if (flag) {
      setReady(true);
      return;
    }

    // tab baru / tab pernah ditutup → sesi dihanguskan.
    // signOut dibatasi 1,5 detik agar tidak pernah menggantung.
    const supabase = createClient();
    Promise.race([
      supabase.auth.signOut({ scope: "local" }),
      new Promise((r) => setTimeout(r, 1500)),
    ])
      .catch(() => {})
      .finally(() => {
        // navigasi penuh: melewati cache router sehingga tidak bisa macet
        window.location.replace("/admin/login");
      });
  }, [isLogin, pathname]);

  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p role="status" className="text-sm text-[#FBF6E6]/50">
          Memeriksa sesi...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}