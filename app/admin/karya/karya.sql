-- Pemeriksa admin (aman dijalankan ulang)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Tabel karya tulis
create table if not exists public.karya (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 150),
  author      text not null default '',
  category    text not null default 'Lainnya',
  content     text not null default '',
  cover_path  text,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists karya_created_idx
  on public.karya (created_at desc, id desc);

alter table public.karya enable row level security;

-- Publik hanya melihat yang terbit; admin melihat semua
create policy "karya_select" on public.karya
  for select using (published or public.is_admin());

create policy "karya_insert" on public.karya
  for insert with check (public.is_admin());

create policy "karya_update" on public.karya
  for update using (public.is_admin()) with check (public.is_admin());

create policy "karya_delete" on public.karya
  for delete using (public.is_admin());

-- Bucket sampul (publik, supaya bisa dibaca halaman publik)
insert into storage.buckets (id, name, public)
values ('karya', 'karya', true)
on conflict (id) do nothing;

create policy "karya_storage_insert" on storage.objects
  for insert with check (bucket_id = 'karya' and public.is_admin());

create policy "karya_storage_update" on storage.objects
  for update using (bucket_id = 'karya' and public.is_admin());

create policy "karya_storage_delete" on storage.objects
  for delete using (bucket_id = 'karya' and public.is_admin());