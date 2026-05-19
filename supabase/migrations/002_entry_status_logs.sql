-- Moderation audit trail: log every status transition on entries.
-- Implements §8.3 of ai-challenge-platform-claude-code-plan.md.

create table if not exists public.entry_status_logs (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  old_status entry_status,
  new_status entry_status not null,
  changed_by text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists entry_status_logs_entry_idx
  on public.entry_status_logs(entry_id, created_at desc);

create or replace function public.log_entry_status_change()
returns trigger
language plpgsql
security definer
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.entry_status_logs (entry_id, old_status, new_status, changed_by, note)
    values (
      new.id,
      null,
      new.status,
      coalesce(current_setting('app.changed_by', true), 'system'),
      'Entry created'
    );
    return new;
  end if;

  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into public.entry_status_logs (entry_id, old_status, new_status, changed_by, note)
    values (
      new.id,
      old.status,
      new.status,
      coalesce(current_setting('app.changed_by', true), 'admin'),
      null
    );
  end if;

  return new;
end;
$$;

drop trigger if exists log_entry_status_change_insert on public.entries;
create trigger log_entry_status_change_insert
after insert on public.entries
for each row execute function public.log_entry_status_change();

drop trigger if exists log_entry_status_change_update on public.entries;
create trigger log_entry_status_change_update
after update of status on public.entries
for each row execute function public.log_entry_status_change();

alter table public.entry_status_logs enable row level security;

-- Logs are admin-only: no public read policy. Service-role bypasses RLS,
-- so admin functions and dashboards can read freely.
