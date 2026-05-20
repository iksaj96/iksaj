const SUPABASE_URL = "https://vvkeqiglorkkycrwsgeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2a2VxaWdsb3Jra3ljcndzZ2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDMyNjcsImV4cCI6MjA5NDY3OTI2N30.Q2K565T0Ojls-9wlWEkDl2Dbn9Xg7SZsR9FQJbZLxrk";

if (!window.supabase) {
    console.error("Supabase CDN belum dimuat! Pastikan script library Supabase ada di HTML Anda.");
}

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { SUPABASE_URL, SUPABASE_ANON_KEY };