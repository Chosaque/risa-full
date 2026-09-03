-- Generic small repeated lists (mission points, benefits, contact channels…).
-- One table, discriminated by list_key, so the admin can ADD items anywhere.
create table if not exists list_items (
  id         uuid primary key default gen_random_uuid(),
  list_key   text not null,
  icon       text not null default '',
  title_th   text not null default '', title_en text not null default '',
  body_th    text not null default '', body_en  text not null default '',
  href       text not null default '',
  image_url  text not null default '',
  status     text not null default 'published' check (status in ('draft','published')),
  sort       int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists list_items_key_idx on list_items (list_key, sort);
drop trigger if exists list_items_set_updated_at on list_items;
create trigger list_items_set_updated_at before update on list_items
  for each row execute function set_updated_at();
