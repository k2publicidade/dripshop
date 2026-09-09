begin;
create or replace function public.upsert_cart_item(p_product uuid,p_quantity integer,p_size text,p_color text)
returns public.cart_items language plpgsql security definer set search_path=public as $$
declare result public.cart_items; available integer;
begin
 if auth.uid() is null then raise exception 'Login necessário'; end if;
 if p_quantity < 1 or p_quantity > 99 then raise exception 'Quantidade inválida'; end if;
 if not exists (select 1 from public.products where id=p_product and is_active) then raise exception 'Produto indisponível'; end if;
 select stock into available from public.product_variants where product_id=p_product and size=p_size and color=p_color for update;
 if available is null or available < p_quantity then raise exception 'Estoque insuficiente'; end if;
 insert into public.cart_items(user_id,product_id,quantity,selected_size,selected_color)
 values(auth.uid(),p_product,p_quantity,p_size,p_color)
 on conflict(user_id,product_id,selected_size,selected_color) do update set quantity=excluded.quantity,updated_at=now()
 returning * into result;
 return result;
end $$;
commit;
