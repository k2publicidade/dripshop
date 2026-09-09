-- Narrow profile updates: account owners may never change their role or identity.
revoke update on public.profiles from anon, authenticated;
grant update (name, phone, cpf) on public.profiles to authenticated;
drop policy if exists orders_owner_insert on public.orders;
drop policy if exists order_items_owner_insert on public.order_items;

alter table public.products add constraint products_price_positive check (price > 0);
alter table public.products add constraint products_stock_nonnegative check (stock >= 0);
alter table public.order_items add constraint order_items_quantity_positive check (quantity > 0);
alter table public.cart_items add constraint cart_items_quantity_positive check (quantity between 1 and 99);
alter table public.orders add column shipping_address jsonb;
alter table public.orders add column tracking_code text;
alter table public.orders add column idempotency_key uuid;
create unique index orders_idempotency on public.orders(user_id,idempotency_key);

create table public.product_variants (
 id uuid primary key default gen_random_uuid(),
 product_id uuid not null references public.products(id) on delete cascade,
 size text not null, color text not null, sku text unique,
 stock integer not null default 0 check(stock >= 0),
 unique(product_id,size,color)
);
alter table public.product_variants enable row level security;
create policy variants_read on public.product_variants for select using (
 exists(select 1 from public.products p where p.id=product_id and (p.is_active or public.is_admin()))
);
create policy variants_admin on public.product_variants for all using(public.is_admin()) with check(public.is_admin());

create table public.store_settings (
 id text primary key default 'store' check(id='store'),
 name text not null default 'DripShop',
 support_email text,
 free_shipping_threshold numeric(10,2) not null default 199 check(free_shipping_threshold >= 0),
 standard_shipping numeric(10,2) not null default 19.90 check(standard_shipping >= 0),
 express_shipping numeric(10,2) not null default 29.90 check(express_shipping >= 0),
 checkout_enabled boolean not null default false,
 updated_at timestamptz not null default now()
);
insert into public.store_settings(id) values('store');
alter table public.store_settings enable row level security;
create policy settings_read on public.store_settings for select using(true);
create policy settings_admin on public.store_settings for update using(public.is_admin()) with check(public.is_admin());

create table public.newsletter_subscribers (
 id uuid primary key default gen_random_uuid(),
 email text unique not null check(length(email) <= 254),
 consent_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
create policy newsletter_admin on public.newsletter_subscribers for select using(public.is_admin());

create table public.contact_messages (
 id uuid primary key default gen_random_uuid(),
 name text not null, email text not null, subject text not null,
 message text not null check(length(message) <= 5000),
 status text not null default 'NEW' check(status in ('NEW','READ','RESOLVED')),
 created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy contact_admin on public.contact_messages for all using(public.is_admin()) with check(public.is_admin());

create table public.payment_events (
 id text primary key, provider text not null, order_id uuid references public.orders(id),
 processed_at timestamptz, created_at timestamptz not null default now()
);
alter table public.payment_events enable row level security;
create policy payment_events_admin_read on public.payment_events for select using(public.is_admin());

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path=public as $$
begin new.updated_at=now(); return new; end $$;

-- Only the server transaction may price a purchase; clients cannot insert orders.
create or replace function public.create_checkout_order(p_items jsonb, p_address_id uuid, p_shipping text, p_key uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare
 v_uid uuid := auth.uid(); v_id uuid; v_item jsonb; v_product public.products;
 v_variant public.product_variants; v_address public.addresses; v_settings public.store_settings;
 v_qty integer; v_subtotal numeric(10,2):=0; v_shipping numeric(10,2); v_count integer:=0;
begin
 if v_uid is null then raise exception 'Autenticação necessária'; end if;
 if p_key is null then raise exception 'Chave do pedido necessária'; end if;
 perform pg_advisory_xact_lock(hashtextextended(v_uid::text,0));
 select id into v_id from public.orders where user_id=v_uid and idempotency_key=p_key;
 if found then return v_id; end if;
 select * into v_settings from public.store_settings where id='store';
 if not v_settings.checkout_enabled then raise exception 'O checkout ainda não está disponível'; end if;
 select * into v_address from public.addresses where id=p_address_id and user_id=v_uid;
 if not found then raise exception 'Endereço inválido'; end if;
 if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 50 then raise exception 'Carrinho inválido'; end if;
 if p_shipping not in ('standard','express') then raise exception 'Entrega inválida'; end if;
 v_id:=gen_random_uuid();
 insert into public.orders(id,order_number,user_id,address_id,shipping_address,payment_method,subtotal,total,idempotency_key)
 values(v_id,'DS-'||upper(substr(replace(v_id::text,'-',''),1,12)),v_uid,p_address_id,to_jsonb(v_address),'UNCONFIGURED',0,0,p_key);
 for v_item in select value from jsonb_array_elements(p_items) order by value->>'productId', value->>'selectedSize', value->>'selectedColor' loop
   v_qty:=(v_item->>'quantity')::integer;
   if v_qty is null or v_qty not between 1 and 99 then raise exception 'Quantidade inválida'; end if;
   select * into v_product from public.products where id=(v_item->>'productId')::uuid and is_active for update;
   if not found then raise exception 'Produto indisponível'; end if;
   select * into v_variant from public.product_variants where product_id=v_product.id and size=v_item->>'selectedSize' and color=v_item->>'selectedColor' for update;
   if not found or v_variant.stock < v_qty or v_product.stock < v_qty then raise exception 'Variação sem estoque suficiente'; end if;
   update public.product_variants set stock=stock-v_qty where id=v_variant.id;
   update public.products set stock=stock-v_qty where id=v_product.id;
   insert into public.order_items(order_id,product_id,product_name,product_image,price,quantity,selected_size,selected_color)
   values(v_id,v_product.id,v_product.name,coalesce(v_product.images[1],''),v_product.price,v_qty,v_variant.size,v_variant.color);
   v_subtotal:=v_subtotal+v_product.price*v_qty;
 end loop;
 v_shipping:=case when p_shipping='express' then v_settings.express_shipping when v_subtotal>=v_settings.free_shipping_threshold then 0 else v_settings.standard_shipping end;
 update public.orders set subtotal=v_subtotal, shipping_cost=v_shipping,total=v_subtotal+v_shipping where id=v_id;
 return v_id;
end $$;
revoke all on function public.create_checkout_order(jsonb,uuid,text,uuid) from public,anon;
grant execute on function public.create_checkout_order(jsonb,uuid,text,uuid) to authenticated;

create index addresses_user_default on public.addresses(user_id,is_default);
create index products_creator on public.products(creator_id);
create index order_items_product on public.order_items(product_id);
create index orders_address on public.orders(address_id);
create index payment_events_order on public.payment_events(order_id);
