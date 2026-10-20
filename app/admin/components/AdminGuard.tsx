"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TAB_FLAG } from "@/lib/admin-tab";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [ready, setReady] = useState(isLogin);

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }

    let alive = true;
    (async () => {
      let flag: string | null = null;
      try {
        flag = sessionStorage.getItem(TAB_FLAG);
      } catch {}

      if (!flag) {
        // tab baru / tab pernah ditutup → sesi dihanguskan
        const supabase = createClient();
        await supabase.auth.signOut({ scope: "local" });
        if (alive) router.replace("/admin/login");
        return;
      }
      if (alive) setReady(true);
    })();

    return () => {
      alive = false;
    };
  }, [isLogin, router, pathname]);

  if (!ready) return null;
  return <>{children}</>;
}