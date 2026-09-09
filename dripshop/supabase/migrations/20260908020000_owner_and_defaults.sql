begin;
-- Bootstrap only the owner email explicitly supplied for this store, after verification.
create or replace function public.activate_store_owner() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if lower(new.email)='admin@dripshop.com.br' and new.email_confirmed_at is not null then
  update public.profiles set role='ADMIN' where id=new.id;
 end if;
 return new;
end $$;
drop trigger if exists on_store_owner_verified on auth.users;
create trigger on_store_owner_verified after insert or update of email,email_confirmed_at on auth.users for each row execute function public.activate_store_owner();
update public.profiles p set role='ADMIN' from auth.users u where p.id=u.id and lower(u.email)='admin@dripshop.com.br' and u.email_confirmed_at is not null;

create or replace function public.ensure_default_address() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.is_default then
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text,0));
  update public.addresses set is_default=false where user_id=new.user_id and id<>new.id and is_default;
 end if;
 return new;
end $$;
create trigger address_default_guard before insert or update of is_default on public.addresses for each row execute function public.ensure_default_address();
drop policy collections_public_read on public.collections;
create policy collections_public_read on public.collections for select using(is_active or public.is_admin());
commit;
