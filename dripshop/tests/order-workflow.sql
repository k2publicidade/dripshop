-- Run as postgres in SQL Editor. Fixtures and changes are rolled back.
begin;
insert into auth.users(id,email,raw_user_meta_data) values('11111111-1111-4111-8111-111111111111','order-test@example.invalid','{}');
update public.profiles set role='ADMIN' where id='11111111-1111-4111-8111-111111111111';
insert into public.products(id,name,slug,description,price,category_id,stock,sizes)
select '44444444-4444-4444-8444-444444444444','Fixture','order-workflow-fixture','Fixture',10,id,3,array['M'] from public.categories limit 1;
insert into public.product_variants(product_id,size,color,stock) values('44444444-4444-4444-8444-444444444444','M','Preto',3);
insert into public.orders(id,order_number,user_id,payment_method,subtotal,total)
values('55555555-5555-4555-8555-555555555555','WORKFLOW-TEST','11111111-1111-4111-8111-111111111111','UNCONFIGURED',20,20);
insert into public.order_items(order_id,product_id,product_name,product_image,price,quantity,selected_size,selected_color)
values('55555555-5555-4555-8555-555555555555','44444444-4444-4444-8444-444444444444','Fixture','',10,2,'M','Preto');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
 begin
  update public.orders set payment_status='PAID';
  raise exception 'FAIL: admin can bypass financial workflow';
 exception when insufficient_privilege then null; end;
 begin
  perform public.admin_transition_order('55555555-5555-4555-8555-555555555555','CONFIRMED');
  raise exception 'FAIL: unpaid order confirmed';
 exception when raise_exception then
  if sqlerrm<>'O pagamento precisa estar confirmado' then raise; end if;
 end;
 perform public.admin_transition_order('55555555-5555-4555-8555-555555555555','CANCELLED');
 perform public.admin_transition_order('55555555-5555-4555-8555-555555555555','CANCELLED');
 if (select stock from public.products where id='44444444-4444-4444-8444-444444444444')<>5 then raise exception 'FAIL: incorrect product restock'; end if;
 if (select stock from public.product_variants where product_id='44444444-4444-4444-8444-444444444444')<>5 then raise exception 'FAIL: incorrect variant restock'; end if;
 if (select count(*) from public.order_status_history where order_id='55555555-5555-4555-8555-555555555555')<>1 then raise exception 'FAIL: duplicate event'; end if;
end $$;
reset role;
insert into public.orders(id,order_number,user_id,payment_method,payment_status,subtotal,total)
values('66666666-6666-4666-8666-666666666666','WORKFLOW-PAID-TEST','11111111-1111-4111-8111-111111111111','UNCONFIGURED','PAID',10,10);
set local role authenticated;
do $$ begin
 begin
  perform public.admin_transition_order('66666666-6666-4666-8666-666666666666','CANCELLED');
  raise exception 'FAIL: paid order cancelled without refund';
 exception when raise_exception then
  if sqlerrm<>'Confirme o reembolso no gateway antes de cancelar' then raise; end if;
 end;
 perform public.admin_transition_order('66666666-6666-4666-8666-666666666666','CONFIRMED');
 begin
  perform public.admin_transition_order('66666666-6666-4666-8666-666666666666','DELIVERED');
  raise exception 'FAIL: skipped fulfillment';
 exception when raise_exception then
  if sqlerrm<>'Transição de status inválida' then raise; end if;
 end;
 perform public.admin_transition_order('66666666-6666-4666-8666-666666666666','PROCESSING');
 begin
  perform public.admin_transition_order('66666666-6666-4666-8666-666666666666','SHIPPED');
  raise exception 'FAIL: shipped without tracking';
 exception when raise_exception then
  if sqlerrm<>'Informe o código de rastreio' then raise; end if;
 end;
 perform public.admin_transition_order('66666666-6666-4666-8666-666666666666','SHIPPED','TEST123');
 perform public.admin_transition_order('66666666-6666-4666-8666-666666666666','DELIVERED');
end $$;
reset role;
select 'PASS: payment guard, restock once, audit history, refund guard, fulfillment sequence and tracking' as result;
rollback;
