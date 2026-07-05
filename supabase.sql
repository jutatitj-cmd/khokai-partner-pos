create table if not exists khokai_products (
  id text primary key,
  sku text unique not null,
  name_th text not null,
  name_kr text,
  weight_g int default 0,
  retail numeric default 0,
  restaurant numeric default 0,
  mart numeric default 0,
  wholesale numeric default 0,
  stock numeric default 0,
  option_id text,
  display_product_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists khokai_partners (
  id text primary key,
  name text not null,
  contact text,
  phone text,
  address text,
  price_group text default 'restaurant',
  route_day text,
  credit_limit numeric default 0,
  seller text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists khokai_partner_orders (
  id text primary key,
  order_no text unique not null,
  partner_id text,
  partner_name text,
  price_group text,
  status text default 'เปิด',
  items jsonb default '[]'::jsonb,
  total numeric default 0,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table khokai_products enable row level security;
alter table khokai_partners enable row level security;
alter table khokai_partner_orders enable row level security;

drop policy if exists "anon all products" on khokai_products;
drop policy if exists "anon all partners" on khokai_partners;
drop policy if exists "anon all orders" on khokai_partner_orders;

create policy "anon all products" on khokai_products for all using (true) with check (true);
create policy "anon all partners" on khokai_partners for all using (true) with check (true);
create policy "anon all orders" on khokai_partner_orders for all using (true) with check (true);
