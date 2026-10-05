-- Replace BOTH occurrences of 00000000-0000-0000-0000-000000000000 with
-- your Supabase Authentication user's UUID BEFORE running this script.
create table public.articles (
 id uuid primary key default gen_random_uuid(),
 title text not null check(length(trim(title)) between 1 and 180),
 category text not null check(length(trim(category)) between 1 and 50),
 author text not null check(length(trim(author)) between 1 and 80),
 excerpt text not null check(length(trim(excerpt)) between 1 and 400),
 body text not null check(length(trim(body)) > 0),
 cover_url text not null default '' check(cover_url='' or cover_url ~ '^https://'),
 status text not null default 'draft' check(status in ('draft','published')),
 published_at timestamptz,
 created_at timestamptz not null default now(),
 check(status!='published' or published_at is not null)
);
alter table public.articles enable row level security;
grant select on public.articles to anon, authenticated;
grant insert, update, delete on public.articles to authenticated;
create policy "Visitors read published articles" on public.articles
 for select to anon, authenticated using(status='published');
create policy "Only the owner manages articles" on public.articles
 for all to authenticated
 using((select auth.uid())='00000000-0000-0000-0000-000000000000'::uuid)
 with check((select auth.uid())='00000000-0000-0000-0000-000000000000'::uuid);
create index articles_published_date on public.articles(published_at desc) where status='published';
