-- =========================================================
-- OPOfpv — Supabase Storage setup
-- Run once: Dashboard -> SQL Editor -> paste -> Run
-- Creates a public "media" bucket for service images + videos.
-- =========================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;


-- Public read (needed so images/videos load on the site)

drop policy if exists "public read media" on storage.objects;
create policy "public read media"
    on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'media');


-- Uploads from the admin (browser)

drop policy if exists "anon upload media" on storage.objects;
create policy "anon upload media"
    on storage.objects
    for insert
    to anon
    with check (bucket_id = 'media');


-- Deletes from the admin

drop policy if exists "anon delete media" on storage.objects;
create policy "anon delete media"
    on storage.objects
    for delete
    to anon
    using (bucket_id = 'media');
