-- Per-challenge toggle to hide approved entries from the public page.
-- Implements §8.1 show_public_entries from the platform plan.

alter table public.challenges
  add column if not exists show_public_entries boolean not null default false;

-- Default to true for any already-active challenges so existing live page
-- behavior (showing approved entries) doesn't break.
update public.challenges
  set show_public_entries = true
  where status in ('active', 'closed', 'archived')
    and show_public_entries = false;
