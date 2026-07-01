create extension if not exists pgcrypto;

create table if not exists public.pm_moons (
  id uuid primary key default gen_random_uuid(),
  moon_slug text unique not null check (moon_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  display_name text not null,
  mooncrumb_hash text not null,
  mooncrumb_salt text not null,
  owner_token_hash text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  stay_label text,
  opened_at timestamptz,
  deleted_at timestamptz,
  is_deleted boolean not null default false,
  failed_attempt_count integer not null default 0,
  last_failed_attempt_at timestamptz
);

create table if not exists public.pm_traces (
  id uuid primary key default gen_random_uuid(),
  moon_id uuid not null references public.pm_moons(id) on delete cascade,
  side text not null check (side in ('creator', 'visitor')),
  trace_type text not null check (trace_type in ('text', 'photo')),
  body_ciphertext text,
  body_iv text,
  body_tag text,
  protected_file_path text,
  created_at timestamptz not null default now(),
  is_blocked boolean not null default false
);

create table if not exists public.pm_events (
  id uuid primary key default gen_random_uuid(),
  moon_id uuid not null references public.pm_moons(id) on delete cascade,
  event_type text not null,
  created_at timestamptz not null default now()
);

create index if not exists pm_moons_slug_idx on public.pm_moons(moon_slug);
create index if not exists pm_moons_expiry_idx on public.pm_moons(expires_at) where is_deleted = false;
create index if not exists pm_traces_moon_created_idx on public.pm_traces(moon_id, created_at);
create index if not exists pm_events_moon_created_idx on public.pm_events(moon_id, created_at desc);

alter table public.pm_moons enable row level security;
alter table public.pm_traces enable row level security;
alter table public.pm_events enable row level security;

revoke all on public.pm_moons from anon, authenticated;
revoke all on public.pm_traces from anon, authenticated;
revoke all on public.pm_events from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pm-pieces',
  'pm-pieces',
  false,
  1048576,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.pm_expired_photo_paths()
returns table(path text)
language sql
security definer
set search_path = public
as $$
  select t.protected_file_path
  from public.pm_traces t
  join public.pm_moons m on m.id = t.moon_id
  where t.protected_file_path is not null
    and (m.expires_at <= now() or m.is_deleted = true);
$$;

create or replace function public.pm_delete_expired_rows()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count bigint;
begin
  delete from public.pm_moons
  where expires_at <= now() or is_deleted = true;
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.pm_expired_photo_paths() from public, anon, authenticated;
revoke all on function public.pm_delete_expired_rows() from public, anon, authenticated;
