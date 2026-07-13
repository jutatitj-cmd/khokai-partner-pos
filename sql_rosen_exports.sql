-- khokai_rosen_exports: marks which (order_no, box_no) shipments have already been
-- included in a "ดาวน์โหลดไฟล์ 로젠" download, so re-downloading (e.g. clicking the
-- button twice, or overlapping ship-date ranges) doesn't register the same box with
-- Rosen a second time and generate a duplicate tracking number.

create table if not exists public.khokai_rosen_exports (
  id bigserial primary key,
  order_no text not null,
  box_no integer not null default 1,
  exported_at timestamptz default now(),
  exported_by text,
  unique(order_no, box_no)
);

alter table public.khokai_rosen_exports enable row level security;

drop policy if exists "anon all khokai_rosen_exports" on public.khokai_rosen_exports;
create policy "anon all khokai_rosen_exports" on public.khokai_rosen_exports
  for all to anon using (true) with check (true);

grant select, insert on public.khokai_rosen_exports to anon, authenticated;
