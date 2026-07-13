-- khokai_order_lock: single-row switch admins toggle to freeze order entry
-- (create/edit/cancel) across Partner POS and Mini POS during the daily
-- cutoff/summary window, so no order can slip in after the courier batch
-- has been finalized. Read/written by both POS apps against the same
-- shared Supabase project.

create table if not exists public.khokai_order_lock (
  id integer primary key default 1,
  locked boolean not null default false,
  note text,
  locked_by text,
  locked_at timestamptz,
  updated_at timestamptz default now()
);

insert into public.khokai_order_lock (id, locked)
values (1, false)
on conflict (id) do nothing;

alter table public.khokai_order_lock enable row level security;

drop policy if exists "anon all khokai_order_lock" on public.khokai_order_lock;
create policy "anon all khokai_order_lock" on public.khokai_order_lock
  for all to anon using (true) with check (true);

grant select, insert, update on public.khokai_order_lock to anon, authenticated;
