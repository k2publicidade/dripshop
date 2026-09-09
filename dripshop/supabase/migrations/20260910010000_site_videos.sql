begin;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('site-videos','site-videos',true,52428800,array['video/mp4'])
on conflict(id) do nothing;
create policy site_videos_read on storage.objects for select to anon,authenticated using(bucket_id='site-videos');
create policy site_videos_insert on storage.objects for insert to authenticated with check(bucket_id='site-videos' and public.is_admin());
create policy site_videos_delete on storage.objects for delete to authenticated using(bucket_id='site-videos' and public.is_admin());
commit;
