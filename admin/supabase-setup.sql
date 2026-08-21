-- =========================================================
-- OPOfpv — Supabase setup
-- Run this once: Dashboard -> SQL Editor -> New query -> paste -> Run
-- =========================================================


-- ---------------------------------------------------------
-- SERVICES
-- ---------------------------------------------------------

create table if not exists public.services (
    id          uuid primary key default gen_random_uuid(),
    title       text not null,
    description text not null,
    background  text,
    created_at  timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "public read services" on public.services;
create policy "public read services"
    on public.services
    for select
    to anon, authenticated
    using (true);

drop policy if exists "anon insert services" on public.services;
create policy "anon insert services"
    on public.services
    for insert
    to anon
    with check (true);

drop policy if exists "anon delete services" on public.services;
create policy "anon delete services"
    on public.services
    for delete
    to anon
    using (true);


-- ---------------------------------------------------------
-- VIDEOS
-- (video files stay in Firebase Storage; only metadata lives here)
-- ---------------------------------------------------------

create table if not exists public.videos (
    id          uuid primary key default gen_random_uuid(),
    title       text not null,
    description text,
    url         text not null,
    file_name   text,
    created_at  timestamptz not null default now()
);

alter table public.videos enable row level security;

drop policy if exists "public read videos" on public.videos;
create policy "public read videos"
    on public.videos
    for select
    to anon, authenticated
    using (true);

drop policy if exists "anon insert videos" on public.videos;
create policy "anon insert videos"
    on public.videos
    for insert
    to anon
    with check (true);

drop policy if exists "anon delete videos" on public.videos;
create policy "anon delete videos"
    on public.videos
    for delete
    to anon
    using (true);
