-- ============================================================================
-- DripShop - Schema inicial Supabase (Postgres)
-- Baseado em prisma/schema.prisma. Integra com auth.users do Supabase.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================
do $$ begin
  create type user_role as enum ('CUSTOMER', 'ADMIN');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('PENDING','PAID','FAILED','REFUNDED');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- Helper: trigger updated_at
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============================================================================
-- PROFILES (espelha auth.users)
-- ============================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  name        text,
  phone       text,
  cpf         text unique,
  role        user_role not null default 'CUSTOMER',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Cria profile automaticamente quando user é criado em auth.users
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- ADDRESSES
-- ============================================================================
create table if not exists public.addresses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  label         text not null default 'Principal',
  street        text not null,
  number        text not null,
  complement    text,
  neighborhood  text not null,
  city          text not null,
  state         text not null,
  zip_code      text not null,
  is_default    boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_addresses_user on public.addresses(user_id);
create trigger trg_addresses_updated before update on public.addresses
  for each row execute function public.set_updated_at();

-- ============================================================================
-- CATEGORIES
-- ============================================================================
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  image       text,
  parent_id   uuid references public.categories(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_categories_updated before update on public.categories
  for each row execute function public.set_updated_at();

-- ============================================================================
-- COLLECTIONS
-- ============================================================================
create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  image       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_collections_updated before update on public.collections
  for each row execute function public.set_updated_at();

-- ============================================================================
-- CREATORS
-- ============================================================================
create table if not exists public.creators (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique not null,
  bio           text,
  image         text,
  verified      boolean not null default false,
  collection_id uuid references public.collections(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger trg_creators_updated before update on public.creators
  for each row execute function public.set_updated_at();

-- ============================================================================
-- PRODUCTS
-- ============================================================================
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text unique not null,
  description     text not null,
  price           numeric(10,2) not null,
  original_price  numeric(10,2),
  discount        int,
  images          text[] not null default '{}',
  category_id     uuid not null references public.categories(id),
  subcategory     text,
  collection_id   uuid references public.collections(id) on delete set null,
  creator_id      uuid references public.creators(id) on delete set null,
  sizes           text[] not null default '{}',
  stock           int not null default 0,
  is_new          boolean not null default false,
  is_featured     boolean not null default false,
  is_active       boolean not null default true,
  theme           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_products_category   on public.products(category_id);
create index if not exists idx_products_collection on public.products(collection_id);
create index if not exists idx_products_slug       on public.products(slug);
create index if not exists idx_products_featured   on public.products(is_featured);
create index if not exists idx_products_new        on public.products(is_new);
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================================
-- PRODUCT COLORS
-- ============================================================================
create table if not exists public.product_colors (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name       text not null,
  hex        text not null,
  image      text
);
create index if not exists idx_product_colors_product on public.product_colors(product_id);

-- ============================================================================
-- ORDERS
-- ============================================================================
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text unique not null,
  user_id         uuid not null references public.profiles(id),
  address_id      uuid references public.addresses(id) on delete set null,
  status          order_status not null default 'PENDING',
  payment_method  text not null,
  payment_status  payment_status not null default 'PENDING',
  subtotal        numeric(10,2) not null,
  shipping_cost   numeric(10,2) not null default 0,
  discount        numeric(10,2) not null default 0,
  total           numeric(10,2) not null,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_orders_user   on public.orders(user_id);
create index if not exists idx_orders_number on public.orders(order_number);
create index if not exists idx_orders_status on public.orders(status);
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================================
-- ORDER ITEMS
-- ============================================================================
create table if not exists public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  product_id     uuid not null references public.products(id),
  product_name   text not null,
  product_image  text not null,
  price          numeric(10,2) not null,
  quantity       int not null,
  selected_size  text not null,
  selected_color text not null,
  created_at     timestamptz not null default now()
);
create index if not exists idx_order_items_order   on public.order_items(order_id);
create index if not exists idx_order_items_product on public.order_items(product_id);

-- ============================================================================
-- CART ITEMS
-- ============================================================================
create table if not exists public.cart_items (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  product_id     uuid not null references public.products(id) on delete cascade,
  quantity       int not null default 1,
  selected_size  text not null,
  selected_color text not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (user_id, product_id, selected_size, selected_color)
);
create index if not exists idx_cart_items_user on public.cart_items(user_id);
create trigger trg_cart_items_updated before update on public.cart_items
  for each row execute function public.set_updated_at();

-- ============================================================================
-- FAVORITES
-- ============================================================================
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);
create index if not exists idx_favorites_user on public.favorites(user_id);

-- ============================================================================
-- FEATURED CATEGORIES (banners home)
-- ============================================================================
create table if not exists public.featured_categories (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  image_url   text not null,
  link_url    text not null,
  button_text text not null default 'COMPRE AQUI',
  position    int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_featured_updated before update on public.featured_categories
  for each row execute function public.set_updated_at();

-- ============================================================================
-- HELPER: is_admin()
-- ============================================================================
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid() and role = 'ADMIN'
  );
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles            enable row level security;
alter table public.addresses           enable row level security;
alter table public.categories          enable row level security;
alter table public.collections         enable row level security;
alter table public.creators            enable row level security;
alter table public.products            enable row level security;
alter table public.product_colors      enable row level security;
alter table public.orders              enable row level security;
alter table public.order_items         enable row level security;
alter table public.cart_items          enable row level security;
alter table public.favorites           enable row level security;
alter table public.featured_categories enable row level security;

-- PROFILES
create policy "profiles_select_self_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ADDRESSES (dono)
create policy "addresses_owner_all" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "addresses_admin_all" on public.addresses
  for all using (public.is_admin()) with check (public.is_admin());

-- Catálogo público (categories/collections/creators/products/product_colors/featured)
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "collections_public_read" on public.collections for select using (true);
create policy "collections_admin_write" on public.collections for all using (public.is_admin()) with check (public.is_admin());

create policy "creators_public_read" on public.creators for select using (true);
create policy "creators_admin_write" on public.creators for all using (public.is_admin()) with check (public.is_admin());

create policy "products_public_read" on public.products for select using (is_active = true or public.is_admin());
create policy "products_admin_write" on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "product_colors_public_read" on public.product_colors for select using (true);
create policy "product_colors_admin_write" on public.product_colors for all using (public.is_admin()) with check (public.is_admin());

create policy "featured_public_read" on public.featured_categories for select using (is_active = true or public.is_admin());
create policy "featured_admin_write" on public.featured_categories for all using (public.is_admin()) with check (public.is_admin());

-- ORDERS (dono lê/cria, admin tudo)
create policy "orders_owner_select" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_owner_insert" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders_admin_update" on public.orders for update using (public.is_admin()) with check (public.is_admin());

create policy "order_items_owner_select" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);
create policy "order_items_owner_insert" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "order_items_admin_all" on public.order_items for all using (public.is_admin()) with check (public.is_admin());

-- CART (dono)
create policy "cart_owner_all" on public.cart_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- FAVORITES (dono)
create policy "favorites_owner_all" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
