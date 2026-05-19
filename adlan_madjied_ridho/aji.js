// adlan_madjied_ridho/aji.js

// 1. Definisikan URL dan Anon Key Supabase Anda
const SUPABASE_URL = "https://vvkeqiglorkkycrwsgeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2a2VxaWdsb3Jra3ljcndzZ2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDMyNjcsImV4cCI6MjA5NDY3OTI2N30.Q2K565T0Ojls-9wlWEkDl2Dbn9Xg7SZsR9FQJbZLxrk";

/**
 * Pastikan CDN Supabase JS sudah dimuat di file HTML sebelum file ini dipanggil.
 * Kita menggunakan library bawaan dari window.supabase untuk membuat client.
 */
if (!window.supabase) {
    console.error("Supabase CDN belum dimuat! Pastikan script library Supabase ada di HTML Anda.");
}

// 2. Inisialisasi Supabase Client
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Opsional: Jika di file lain Anda hanya ingin mengambil URL atau Key-nya saja
export { SUPABASE_URL, SUPABASE_ANON_KEY };