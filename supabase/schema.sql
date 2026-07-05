-- KHOKAI ERP Lite V2 draft schema
create table if not exists partner_tiers (id text primary key, name text not null);
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier_id text references partner_tiers(id),
  phone text,
  address text,
  seller text,
  credit_days int default 0,
  route_day text,
  payment_avg_days numeric default 0,
  balance numeric default 0,
  tax_type text,
  biz_no text,
  created_at timestamptz default now()
);
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  option_id text,
  exposed_product_id text,
  name_th text,
  name_kr text,
  unit text default 'pack',
  box_qty numeric default 1,
  spec text,
  stock_pack numeric default 0,
  created_at timestamptz default now()
);
create table if not exists product_prices (
  product_id uuid references products(id) on delete cascade,
  tier_id text references partner_tiers(id),
  price numeric not null default 0,
  primary key(product_id,tier_id)
);
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique,
  order_date date not null default current_date,
  partner_id uuid references partners(id),
  status text default 'open',
  payment_status text default 'unpaid',
  due_date date,
  paid_date date,
  total numeric default 0,
  memo text,
  created_at timestamptz default now()
);
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  sell_unit text default 'pack',
  qty numeric not null default 1,
  pack_qty numeric not null default 1,
  unit_price numeric not null default 0,
  line_total numeric not null default 0
);
create table if not exists partner_crm_logs (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partners(id) on delete cascade,
  log_date date default current_date,
  channel text,
  note text,
  next_followup_date date,
  created_at timestamptz default now()
);

-- V2.1.1: optional compatibility table for Partner POS Product Master
-- If your Mini POS already has product_option, keep using the existing table.
-- Add any missing columns below only when needed.
create table if not exists product_option (
  id uuid primary key default gen_random_uuid(),
  sku text,
  option_id text,
  display_product_id text,
  product_name_th text,
  product_name_ko text,
  unit text default 'pack',
  pack_per_box numeric default 1,
  spec text,
  retail numeric default 0,
  restaurant numeric default 0,
  mart numeric default 0,
  wholesale numeric default 0,
  vip numeric default 0,
  stock_pack numeric default 0,
  active boolean default true,
  updated_at timestamptz default now()
);

create table if not exists message_templates (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text,
  message_th text,
  message_ko text,
  active boolean default true,
  updated_at timestamptz default now()
);
