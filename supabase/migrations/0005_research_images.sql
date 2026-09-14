-- Optional per-entry image; existing research content remains untouched.
alter table research_items add column if not exists cover_url text not null default '';
