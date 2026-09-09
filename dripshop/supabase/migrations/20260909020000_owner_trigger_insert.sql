begin;
drop trigger if exists on_store_owner_verified on auth.users;
create trigger on_store_owner_verified after insert or update of email,email_confirmed_at on auth.users for each row execute function public.activate_store_owner();
update public.profiles p set role='ADMIN' from auth.users u where p.id=u.id and lower(u.email)='admin@dripshop.com.br' and u.email_confirmed_at is not null;
commit;
