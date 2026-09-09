begin;
insert into auth.users(id,email,raw_user_meta_data) values('11111111-1111-4111-8111-111111111111','storage-test@example.invalid','{}');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
 begin
  insert into storage.objects(bucket_id,name) values('product-images','security-fixture.png');
  raise exception 'FAIL: customer can upload images';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
update public.profiles set role='ADMIN' where id='11111111-1111-4111-8111-111111111111';
set local role authenticated;
insert into storage.objects(bucket_id,name) values('product-images','security-fixture.png');
reset role;
set local role anon;
do $$ begin
 if not exists(select 1 from storage.objects where bucket_id='product-images' and name='security-fixture.png') then raise exception 'FAIL: public cannot read images'; end if;
end $$;
reset role;
select 'PASS: customer upload denied, admin upload allowed, public image read allowed' as result;
rollback;
