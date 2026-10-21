"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const PATH = "/admin/struktur";
const PERAN = ["koordinator", "anggota"];

type Supabase = Awaited<ReturnType<typeof createClient>>;

/* ---------- helper ---------- */

function text(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}

function opt(fd: FormData, key: string) {
  const v = text(fd, key);
  return v === "" ? null : v;
}

// Kembali ke halaman struktur, membawa pesan error bila ada.
function back(periodeId: string | null, error?: string): never {
  const params = new URLSearchParams();
  if (periodeId) params.set("periode", periodeId);
  if (error) params.set("error", error);
  const query = params.toString();
  redirect(query ? `${PATH}?${query}` : PATH);
}

function selesai(periodeId: string | null): never {
  revalidatePath(PATH);
  back(periodeId);
}

async function requireAdmin(periodeId: string | null) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    back(periodeId, "Hanya admin yang boleh mengubah struktur.");
  }

  return supabase;
}

// Urutan kosong -> otomatis di paling akhir
async function ambilUrutan(
  supabase: Supabase,
  fd: FormData,
  table: "seksi" | "pengurus",
  kolom: "periode_id" | "seksi_id",
  nilai: string
) {
  const input = opt(fd, "urutan");
  if (input !== null && Number.isFinite(Number(input))) {
    return Math.trunc(Number(input));
  }

  const { data } = await supabase
    .from(table)
    .select("urutan")
    .eq(kolom, nilai)
    .order("urutan", { ascending: false })
    .limit(1);

  return (data?.[0]?.urutan ?? 0) + 1;
}

/* ---------- periode ---------- */

export async function tambahPeriode(fd: FormData) {
  const supabase = await requireAdmin(null);

  const nama = text(fd, "nama");
  if (!nama) back(null, "Nama periode wajib diisi.");

  const aktif = fd.get("aktif") === "on";
  if (aktif) {
    await supabase.from("periode").update({ aktif: false }).eq("aktif", true);
  }

  const { data: terakhir } = await supabase
    .from("periode")
    .select("urutan")
    .order("urutan", { ascending: false })
    .limit(1);
  const urutan = (terakhir?.[0]?.urutan ?? 0) + 1;

  const { data, error } = await supabase
    .from("periode")
    .insert({ nama, aktif, urutan })
    .select("id")
    .single();

  if (error) back(null, error.message);
  selesai(data.id);
}

export async function ubahPeriode(fd: FormData) {
  const id = text(fd, "id");
  const supabase = await requireAdmin(id);

  const nama = text(fd, "nama");
  if (!nama) back(id, "Nama periode wajib diisi.");

  const { error } = await supabase.from("periode").update({ nama }).eq("id", id);
  if (error) back(id, error.message);
  selesai(id);
}

export async function aktifkanPeriode(fd: FormData) {
  const id = text(fd, "id");
  const supabase = await requireAdmin(id);

  // Hanya boleh satu periode aktif, jadi matikan yang lama dulu
  await supabase.from("periode").update({ aktif: false }).eq("aktif", true);

  const { error } = await supabase
    .from("periode")
    .update({ aktif: true })
    .eq("id", id);

  if (error) back(id, error.message);
  selesai(id);
}

export async function hapusPeriode(fd: FormData) {
  const id = text(fd, "id");
  const supabase = await requireAdmin(id);

  // Seksi dan pengurus di dalamnya ikut terhapus (on delete cascade)
  const { error } = await supabase.from("periode").delete().eq("id", id);
  if (error) back(id, error.message);
  selesai(null);
}

/* ---------- seksi ---------- */

export async function tambahSeksi(fd: FormData) {
  const periodeId = text(fd, "periode_id");
  const supabase = await requireAdmin(periodeId);

  const nama = text(fd, "nama");
  if (!nama) back(periodeId, "Nama seksi wajib diisi.");

  const urutan = await ambilUrutan(supabase, fd, "seksi", "periode_id", periodeId);

  const { error } = await supabase.from("seksi").insert({
    periode_id: periodeId,
    nama,
    deskripsi: opt(fd, "deskripsi"),
    urutan,
  });

  if (error) back(periodeId, error.message);
  selesai(periodeId);
}

export async function ubahSeksi(fd: FormData) {
  const id = text(fd, "id");
  const periodeId = text(fd, "periode_id");
  const supabase = await requireAdmin(periodeId);

  const nama = text(fd, "nama");
  if (!nama) back(periodeId, "Nama seksi wajib diisi.");

  const urutanInput = opt(fd, "urutan");

  const perubahan: Record<string, unknown> = {
    nama,
    deskripsi: opt(fd, "deskripsi"),
  };
  if (urutanInput !== null && Number.isFinite(Number(urutanInput))) {
    perubahan.urutan = Math.trunc(Number(urutanInput));
  }

  const { error } = await supabase.from("seksi").update(perubahan).eq("id", id);
  if (error) back(periodeId, error.message);
  selesai(periodeId);
}

export async function hapusSeksi(fd: FormData) {
  const id = text(fd, "id");
  const periodeId = text(fd, "periode_id");
  const supabase = await requireAdmin(periodeId);

  const { error } = await supabase.from("seksi").delete().eq("id", id);
  if (error) back(periodeId, error.message);
  selesai(periodeId);
}

/* ---------- pengurus ---------- */

export async function tambahPengurus(fd: FormData) {
  const seksiId = text(fd, "seksi_id");
  const periodeId = text(fd, "periode_id");
  const supabase = await requireAdmin(periodeId);

  const nama = text(fd, "nama");
  if (!nama) back(periodeId, "Nama wajib diisi.");

  const peran = PERAN.includes(text(fd, "peran")) ? text(fd, "peran") : null;
  const urutan = await ambilUrutan(supabase, fd, "pengurus", "seksi_id", seksiId);

  const { error } = await supabase.from("pengurus").insert({
    seksi_id: seksiId,
    nama,
    jabatan: opt(fd, "jabatan"),
    peran,
    urutan,
  });

  if (error) back(periodeId, error.message);
  selesai(periodeId);
}

export async function ubahPengurus(fd: FormData) {
  const id = text(fd, "id");
  const periodeId = text(fd, "periode_id");
  const supabase = await requireAdmin(periodeId);

  const nama = text(fd, "nama");
  if (!nama) back(periodeId, "Nama wajib diisi.");

  const peran = PERAN.includes(text(fd, "peran")) ? text(fd, "peran") : null;
  const urutanInput = opt(fd, "urutan");

  const perubahan: Record<string, unknown> = {
    nama,
    jabatan: opt(fd, "jabatan"),
    peran,
  };
  if (urutanInput !== null && Number.isFinite(Number(urutanInput))) {
    perubahan.urutan = Math.trunc(Number(urutanInput));
  }

  const { error } = await supabase
    .from("pengurus")
    .update(perubahan)
    .eq("id", id);

  if (error) back(periodeId, error.message);
  selesai(periodeId);
}

export async function hapusPengurus(fd: FormData) {
  const id = text(fd, "id");
  const periodeId = text(fd, "periode_id");
  const supabase = await requireAdmin(periodeId);

  const { error } = await supabase.from("pengurus").delete().eq("id", id);
  if (error) back(periodeId, error.message);
  selesai(periodeId);
}

/* ---------- ubah urutan (drag & drop) ---------- */

async function adminAtauNull() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin" ? supabase : null;
}

export async function urutkanSeksi(
  periodeId: string,
  ids: string[]
): Promise<{ error?: string }> {
  const supabase = await adminAtauNull();
  if (!supabase) return { error: "Hanya admin yang boleh mengubah urutan." };

  const hasil = await Promise.all(
    ids.map((id, index) =>
      supabase
        .from("seksi")
        .update({ urutan: index + 1 })
        .eq("id", id)
        .eq("periode_id", periodeId)
    )
  );

  const gagal = hasil.find((item) => item.error);
  if (gagal?.error) return { error: gagal.error.message };

  revalidatePath(PATH);
  return {};
}

export async function urutkanPengurus(
  seksiId: string,
  ids: string[]
): Promise<{ error?: string }> {
  const supabase = await adminAtauNull();
  if (!supabase) return { error: "Hanya admin yang boleh mengubah urutan." };

  const hasil = await Promise.all(
    ids.map((id, index) =>
      supabase
        .from("pengurus")
        .update({ urutan: index + 1 })
        .eq("id", id)
        .eq("seksi_id", seksiId)
    )
  );

  const gagal = hasil.find((item) => item.error);
  if (gagal?.error) return { error: gagal.error.message };

  revalidatePath(PATH);
  return {};
}

export async function urutkanPeriode(
  ids: string[]
): Promise<{ error?: string }> {
  const supabase = await adminAtauNull();
  if (!supabase) return { error: "Hanya admin yang boleh mengubah urutan." };

  const hasil = await Promise.all(
    ids.map((id, index) =>
      supabase
        .from("periode")
        .update({ urutan: index + 1 })
        .eq("id", id)
    )
  );

  const gagal = hasil.find((item) => item.error);
  if (gagal?.error) return { error: gagal.error.message };

  revalidatePath(PATH);
  return {};
}