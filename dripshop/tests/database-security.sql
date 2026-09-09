-- Transactional security smoke tests. All fixtures are rolled back.
begin;
insert into auth.users(id,email,raw_user_meta_data) values('11111111-1111-4111-8111-111111111111','security-test-one@example.invalid','{}'),('22222222-2222-4222-8222-222222222222','security-test-two@example.invalid','{}');
insert into public.addresses(id,user_id,street,number,neighborhood,city,state,zip_code) values('33333333-3333-4333-8333-333333333333','22222222-2222-4222-8222-222222222222','Fixture','1','Fixture','Fixture','SP','01001000');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
 if (select count(*) from public.profiles)<>1 then raise exception 'FAIL: profiles cross-user read'; end if;
 if (select count(*) from public.addresses)<>0 then raise exception 'FAIL: addresses cross-user read'; end if;
 if public.is_admin() then raise exception 'FAIL: customer is admin'; end if;
 begin
  update public.profiles set role='ADMIN' where id=auth.uid();
  raise exception 'FAIL: customer can promote role';
 exception when insufficient_privilege then null; end;
 begin
  perform public.admin_save_product(null,'{}','[]');
  raise exception 'FAIL: customer can modify products';
 exception when raise_exception then
  if sqlerrm<>'Acesso restrito' then raise; end if;
 end;
 begin
  perform public.set_default_address('33333333-3333-4333-8333-333333333333');
  raise exception 'FAIL: customer can edit another address';
 exception when raise_exception then
  if sqlerrm<>'Endereço não encontrado' then raise; end if;
 end;
 begin
  perform public.create_checkout_order('[]','33333333-3333-4333-8333-333333333333','standard',gen_random_uuid());
  raise exception 'FAIL: checkout was not gated';
 exception when raise_exception then
  if sqlerrm<>'O checkout ainda não está disponível' then raise; end if;
 end;
end $$;
reset role;
select 'PASS: profile isolation, address isolation, role escalation blocked, admin RPC blocked, checkout gated' as result;
rollback;
