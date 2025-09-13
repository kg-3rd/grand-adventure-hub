-- Supabase setup for The Grand Hiking & Adventures
-- Safe to run multiple times

-- 1) Reviews table
create table if not exists public.reviews (
  id bigserial primary key,
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  approved boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Index for faster filtering
create index if not exists reviews_approved_created_idx on public.reviews (approved, created_at desc);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policies
-- Anyone (anon or authenticated) can insert a review
create policy if not exists "Public can insert reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (true);

-- Anyone can select only approved reviews
create policy if not exists "Public can select approved reviews"
  on public.reviews for select
  to anon, authenticated
  using (approved = true);

-- 2) Optional summary view (non-materialized for simplicity)
create view if not exists public.approved_reviews_summary as
select round(avg(rating)::numeric, 2) as avg_rating, count(*)::bigint as total_reviews
from public.reviews
where approved = true;

-- Grant select on the view to anon/authenticated
grant select on public.approved_reviews_summary to anon, authenticated;

-- 3) Storage buckets
-- Public read, writes go through Netlify Function (service role bypasses RLS)
select
  case when not exists (
    select 1 from storage.buckets where id = 'events-posters'
  ) then storage.create_bucket('events-posters', public => true) end;

select
  case when not exists (
    select 1 from storage.buckets where id = 'gallery'
  ) then storage.create_bucket('gallery', public => true) end;

-- Storage RLS policies
-- Allow public read from both buckets
create policy if not exists "Public can read events-posters"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'events-posters');

create policy if not exists "Public can read gallery"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

-- (No public insert/update/delete; service role handles writes)
