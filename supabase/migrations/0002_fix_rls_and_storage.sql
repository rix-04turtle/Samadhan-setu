-- ============================================================
-- SamadhanSetu — Fix RLS and Storage Policies (Universal Fix)
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. Ensure the bucket 'problem-media' exists and is set to Public
insert into storage.buckets (id, name, public)
values ('problem-media', 'problem-media', true)
on conflict (id) do update set public = true;

-- 2. Clean up any existing storage policies for this bucket
drop policy if exists "Allow authenticated uploads to problem-media" on storage.objects;
drop policy if exists "Allow public read of problem-media" on storage.objects;
drop policy if exists "Allow authenticated update to problem-media" on storage.objects;
drop policy if exists "Allow authenticated delete to problem-media" on storage.objects;
drop policy if exists "Allow all access to problem-media" on storage.objects;
drop policy if exists "problem_media_public_all" on storage.objects;

-- 3. Create a single all-encompassing policy for 'problem-media'
-- Grants SELECT, INSERT, UPDATE, DELETE to both authenticated and anon users
-- Handles the INSERT ... RETURNING metadata check seamlessly
create policy "problem_media_public_all"
on storage.objects
for all
to public
using (bucket_id = 'problem-media' or bucket_id ilike '%problem%media%')
with check (bucket_id = 'problem-media' or bucket_id ilike '%problem%media%');

-- 4. Sync any existing auth.users into public.users
insert into public.users (id, role)
select id, 'citizen'
from auth.users
on conflict (id) do nothing;

-- 5. Ensure public.problems permits authenticated inserts and public reads
alter table public.problems enable row level security;

drop policy if exists "problems: citizen insert" on public.problems;
create policy "problems: citizen insert"
  on public.problems for insert
  to authenticated
  with check (true);

drop policy if exists "problems: citizen read own" on public.problems;
drop policy if exists "problems: read problems" on public.problems;
create policy "problems: read problems"
  on public.problems for select
  to public
  using (true);
