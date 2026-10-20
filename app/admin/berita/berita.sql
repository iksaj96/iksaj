-- Pemeriksa admin (aman dijalankan ulang, sama dengan milik Karya)
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

create table if not exists public.berita (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null check (char_length(title) between 1 and 150),
  summary     text not null default '' check (char_length(summary) <= 300),
  category    text not null default 'Kegiatan',
  content     text not null default '',
  cover_path  text,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists berita_created_idx
  on public.berita (created_at desc, id desc);

alter table public.berita enable row level security;

create policy "berita_select" on public.berita
  for select using (published or public.is_admin());

create policy "berita_insert" on public.berita
  for insert with check (public.is_admin());

create policy "berita_update" on public.berita
  for update using (public.is_admin()) with check (public.is_admin());

create policy "berita_delete" on public.berita
  for delete using (public.is_admin());

-- Bucket gambar berita (publik)
insert into storage.buckets (id, name, public)
values ('berita', 'berita', true)
on conflict (id) do nothing;

create policy "berita_storage_insert" on storage.objects
  for insert with check (bucket_id = 'berita' and public.is_admin());

create policy "berita_storage_update" on storage.objects
  for update using (bucket_id = 'berita' and public.is_admin());

create policy "berita_storage_delete" on storage.objects
  for delete using (bucket_id = 'berita' and public.is_admin());