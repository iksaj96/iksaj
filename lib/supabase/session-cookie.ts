import type { CookieOptions } from "@supabase/ssr";

// Jadikan cookie Supabase sebagai cookie sesi (hilang saat browser ditutup).
// maxAge 0 = perintah hapus cookie (logout), jangan diubah.
export function asSessionCookie(options: CookieOptions = {}): CookieOptions {
  if (options.maxAge === 0) return options;
  const rest = { ...options };
  delete rest.maxAge;
  delete rest.expires;
  return rest;
}