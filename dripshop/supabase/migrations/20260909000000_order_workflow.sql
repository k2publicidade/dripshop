begin;
create table public.order_status_history (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references public.orders(id),
 actor_id uuid references auth.users(id),
 previous_status public.order_status not null,
 status public.order_status not null,
 note text not null default '',
 created_at timestamptz not null default now()
);
alter table public.order_status_history enable row level security;
create policy order_history_read on public.order_status_history for select using (
 public.is_admin() or exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid())
);
create index order_history_order on public.order_status_history(order_id,created_at);
alter table public.orders add column stock_released_at timestamptz;

create or replace function public.admin_transition_order(p_id uuid,p_status public.order_status,p_tracking text default null,p_note text default '')
returns void language plpgsql security definer set search_path=public as $$
declare v_order public.orders; v_item record;
begin
 if not public.is_admin() then raise exception 'Acesso restrito'; end if;
 select * into v_order from public.orders where id=p_id for update;
 if not found then raise exception 'Pedido não encontrado'; end if;
 if p_status is null then raise exception 'Status necessário'; end if;
 if length(coalesce(p_tracking,''))>100 or length(coalesce(p_note,''))>1000 then raise exception 'Texto muito longo'; end if;
 if v_order.status=p_status then return; end if;
 if not (
  (v_order.status='PENDING' and p_status in ('CONFIRMED','CANCELLED')) or
  (v_order.status='CONFIRMED' and p_status in ('PROCESSING','CANCELLED')) or
  (v_order.status='PROCESSING' and p_status in ('SHIPPED','CANCELLED')) or
  (v_order.status='SHIPPED' and p_status='DELIVERED')
 ) then raise exception 'Transição de status inválida'; end if;
 if p_status in ('CONFIRMED','PROCESSING','SHIPPED','DELIVERED') and v_order.payment_status<>'PAID' then
  raise exception 'O pagamento precisa estar confirmado';
 end if;
 if p_status='SHIPPED' and length(trim(coalesce(p_tracking,v_order.tracking_code,'')))=0 then
  raise exception 'Informe o código de rastreio';
 end if;
 if p_status='CANCELLED' then
  if v_order.payment_status not in ('PENDING','FAILED','REFUNDED') then
   raise exception 'Confirme o reembolso no gateway antes de cancelar';
  end if;
  if v_order.stock_released_at is null then
   for v_item in select product_id,selected_size,selected_color,sum(quantity)::integer as quantity
      from public.order_items where order_id=p_id group by product_id,selected_size,selected_color
      order by product_id,selected_size,selected_color loop
    perform 1 from public.products where id=v_item.product_id for update;
    insert into public.product_variants(product_id,size,color,stock)
    values(v_item.product_id,v_item.selected_size,v_item.selected_color,v_item.quantity)
    on conflict(product_id,size,color) do update set stock=public.product_variants.stock+excluded.stock;
    update public.products set stock=stock+v_item.quantity where id=v_item.product_id;
   end loop;
  end if;
 end if;
 update public.orders set status=p_status,tracking_code=coalesce(nullif(trim(p_tracking),''),tracking_code),
  stock_released_at=case when p_status='CANCELLED' then coalesce(stock_released_at,now()) else stock_released_at end
 where id=p_id;
 insert into public.order_status_history(order_id,actor_id,previous_status,status,note)
 values(p_id,auth.uid(),v_order.status,p_status,coalesce(p_note,''));
end $$;
revoke all on function public.admin_transition_order(uuid,public.order_status,text,text) from public,anon;
grant execute on function public.admin_transition_order(uuid,public.order_status,text,text) to authenticated;
-- Workflow changes and financial state must go through checked functions/webhooks.
revoke update on public.orders from authenticated;
grant update(tracking_code) on public.orders to authenticated;
commit;
