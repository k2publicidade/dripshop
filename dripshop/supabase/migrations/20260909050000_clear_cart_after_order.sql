begin;
create or replace function public.clear_cart_after_order() returns trigger language plpgsql security definer set search_path=public as $$
begin
 delete from public.cart_items where user_id=new.user_id;
 return new;
end $$;
drop trigger if exists orders_clear_cart on public.orders;
create trigger orders_clear_cart after insert on public.orders for each row execute function public.clear_cart_after_order();
commit;
