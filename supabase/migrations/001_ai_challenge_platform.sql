create extension if not exists pgcrypto;

do $$
begin
  create type challenge_status as enum ('draft', 'active', 'closed', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type entry_status as enum ('new', 'approved', 'rejected', 'shortlisted', 'finalist', 'winner');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  full_instructions text[] not null default '{}',
  instagram_keyword text not null unique,
  hashtag text not null,
  prize_details text,
  start_date date not null,
  end_date date not null,
  cover_image_url text,
  rules text[] not null default '{}',
  judging_criteria text[] not null default '{}',
  status challenge_status not null default 'draft',
  notion_page_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  name text,
  instagram_username text not null unique,
  instagram_user_id text,
  email text,
  phone text,
  manychat_contact_id text,
  last_seen_at timestamptz,
  notion_page_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  manychat_contact_id text,
  submission_type text not null check (submission_type in ('post', 'reel', 'upload')),
  submission_url text not null,
  uploaded_media_url text,
  ai_tools_used text[] not null default '{}',
  caption text,
  status entry_status not null default 'new',
  score integer check (score is null or (score >= 0 and score <= 100)),
  admin_notes text,
  raw_payload jsonb not null default '{}'::jsonb,
  notion_page_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (challenge_id, submission_url),
  unique (challenge_id, participant_id)
);

create index if not exists challenges_status_idx on public.challenges(status);
create index if not exists challenges_dates_idx on public.challenges(start_date, end_date);
create index if not exists participants_manychat_contact_idx on public.participants(manychat_contact_id);
create index if not exists entries_challenge_status_idx on public.entries(challenge_id, status);
create index if not exists entries_created_at_idx on public.entries(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_challenges_updated_at on public.challenges;
create trigger set_challenges_updated_at
before update on public.challenges
for each row execute function public.set_updated_at();

drop trigger if exists set_participants_updated_at on public.participants;
create trigger set_participants_updated_at
before update on public.participants
for each row execute function public.set_updated_at();

drop trigger if exists set_entries_updated_at on public.entries;
create trigger set_entries_updated_at
before update on public.entries
for each row execute function public.set_updated_at();

alter table public.challenges enable row level security;
alter table public.participants enable row level security;
alter table public.entries enable row level security;

drop policy if exists "Public can read active challenges" on public.challenges;
create policy "Public can read active challenges"
on public.challenges
for select
using (status in ('active', 'closed', 'archived'));

drop policy if exists "Public can read approved entries" on public.entries;
create policy "Public can read approved entries"
on public.entries
for select
using (status in ('approved', 'shortlisted', 'finalist', 'winner'));

insert into storage.buckets (id, name, public)
values
  ('challenge-covers', 'challenge-covers', true),
  ('entry-media', 'entry-media', false),
  ('winner-assets', 'winner-assets', true)
on conflict (id) do nothing;
