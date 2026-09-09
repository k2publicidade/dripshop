begin;
alter table public.site_sections add column if not exists appearance jsonb not null default '{}'::jsonb;
commit;
