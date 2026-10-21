import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

async function handler() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("keepalive_ping");

    if (error) throw error;
    if (!data) throw new Error("Baris keepalive (id = 1) tidak ditemukan.");

    return NextResponse.json(
      {
        status: "ok",
        last_ping: data,
        checked_at: new Date().toISOString(),
      },
      { status: 200, headers: NO_STORE }
    );
  } catch (err) {
    console.error("keepalive:", err);
    return NextResponse.json(
      { status: "error" },
      { status: 500, headers: NO_STORE }
    );
  }
}

export { handler as GET, handler as HEAD };