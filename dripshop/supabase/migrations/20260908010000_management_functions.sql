begin;
create or replace function public.set_default_address(p_id uuid) returns void language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null then raise exception 'Autenticação necessária'; end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 if not exists(select 1 from public.addresses where id=p_id and user_id=auth.uid()) then raise exception 'Endereço não encontrado'; end if;
 update public.addresses set is_default=false where user_id=auth.uid();
 update public.addresses set is_default=true where id=p_id and user_id=auth.uid();
end $$;
revoke all on function public.set_default_address(uuid) from public,anon;
grant execute on function public.set_default_address(uuid) to authenticated;

create or replace function public.admin_save_product(p_id uuid,p_data jsonb,p_variants jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare v_id uuid:=coalesce(p_id,gen_random_uuid()); v_variant jsonb; v_stock integer:=0; v_colors jsonb; v_sizes text[];
begin
 if not public.is_admin() then raise exception 'Acesso restrito'; end if;
 if jsonb_array_length(p_variants) not between 1 and 200 then raise exception 'Informe as variações'; end if;
 select array_agg(distinct value->>'size'),sum((value->>'stock')::integer) into v_sizes,v_stock from jsonb_array_elements(p_variants);
 if v_stock < 0 then raise exception 'Estoque inválido'; end if;
 insert into public.products(id,name,slug,description,price,original_price,images,category_id,collection_id,sizes,stock,is_new,is_featured,is_active)
 values(v_id,p_data->>'name',p_data->>'slug',p_data->>'description',(p_data->>'price')::numeric,nullif(p_data->>'original_price','')::numeric,array(select jsonb_array_elements_text(p_data->'images')),(p_data->>'category_id')::uuid,nullif(p_data->>'collection_id','')::uuid,v_sizes,v_stock,coalesce((p_data->>'is_new')::boolean,false),coalesce((p_data->>'is_featured')::boolean,false),coalesce((p_data->>'is_active')::boolean,true))
 on conflict(id) do update set name=excluded.name,slug=excluded.slug,description=excluded.description,price=excluded.price,original_price=excluded.original_price,images=excluded.images,category_id=excluded.category_id,collection_id=excluded.collection_id,sizes=excluded.sizes,stock=excluded.stock,is_new=excluded.is_new,is_featured=excluded.is_featured,is_active=excluded.is_active;
 delete from public.product_variants where product_id=v_id;
 delete from public.product_colors where product_id=v_id;
 for v_variant in select value from jsonb_array_elements(p_variants) loop
  insert into public.product_variants(product_id,size,color,stock,sku) values(v_id,v_variant->>'size',v_variant->>'color',(v_variant->>'stock')::integer,nullif(v_variant->>'sku',''));
 end loop;
 insert into public.product_colors(product_id,name,hex) select v_id,value->>'color',min(value->>'hex') from jsonb_array_elements(p_variants) group by value->>'color';
 return v_id;
end $$;
revoke all on function public.admin_save_product(uuid,jsonb,jsonb) from public,anon;
grant execute on function public.admin_save_product(uuid,jsonb,jsonb) to authenticated;

create or replace function public.subscribe_newsletter(p_email text) returns void language plpgsql security definer set search_path=public as $$
begin
 if length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Email inválido'; end if;
 insert into public.newsletter_subscribers(email) values(lower(trim(p_email))) on conflict(email) do nothing;
end $$;
revoke all on function public.subscribe_newsletter(text) from public;
grant execute on function public.subscribe_newsletter(text) to anon,authenticated;

create or replace function public.submit_contact(p_name text,p_email text,p_subject text,p_message text) returns void language plpgsql security definer set search_path=public as $$
begin
 if length(p_name) not between 2 and 100 or length(p_subject) not between 2 and 150 or length(p_message) not between 10 and 5000 or length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Dados inválidos'; end if;
 perform pg_advisory_xact_lock(hashtextextended(lower(p_email),1));
 if (select count(*) from public.contact_messages where email=lower(p_email) and created_at>now()-interval '1 hour')>=3 then raise exception 'Aguarde antes de enviar outra mensagem'; end if;
 insert into public.contact_messages(name,email,subject,message) values(p_name,lower(p_email),p_subject,p_message);
end $$;
revoke all on function public.submit_contact(text,text,text,text) from public;
grant execute on function public.submit_contact(text,text,text,text) to anon,authenticated;
commit;
