begin;
insert into auth.users(id,email,raw_user_meta_data) values('11111111-1111-4111-8111-111111111111','cart-test@example.invalid','{}');
insert into public.products(id,name,slug,description,price,category_id,stock,is_active)
select '77777777-7777-4777-8777-777777777777','Cart fixture','cart-stock-fixture','Fixture',10,id,2,true from public.categories limit 1;
insert into public.product_variants(product_id,size,color,stock) values('77777777-7777-4777-8777-777777777777','M','Preto',2);
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
 perform public.upsert_cart_item('77777777-7777-4777-8777-777777777777',2,'M','Preto');
 begin perform public.upsert_cart_item('77777777-7777-4777-8777-777777777777',3,'M','Preto'); raise exception 'FAIL: stock limit bypassed'; exception when raise_exception then if sqlerrm<>'Estoque insuficiente' then raise; end if; end;
 reset role;
 update public.products set is_active=false where id='77777777-7777-4777-8777-777777777777';
 set local role authenticated;
 begin perform public.upsert_cart_item('77777777-7777-4777-8777-777777777777',1,'M','Preto'); raise exception 'FAIL: inactive product accepted'; exception when raise_exception then if sqlerrm<>'Produto indisponível' then raise; end if; end;
 if (select quantity from public.cart_items where product_id='77777777-7777-4777-8777-777777777777')<>2 then raise exception 'FAIL: valid cart item missing'; end if;
end $$;
reset role;
select 'PASS: cart stock and active-product guards' as result;
rollback;
