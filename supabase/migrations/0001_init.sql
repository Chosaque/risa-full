-- RISA site schema. Plain Postgres; portable to Supabase unchanged.
create extension if not exists "pgcrypto";

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------------------------------------------------------------- settings
create table if not exists settings (
  id            boolean primary key default true check (id),
  org_name_th   text not null default '',
  org_name_en   text not null default '',
  org_short     text not null default 'RISA',
  tagline_th    text not null default '',
  tagline_en    text not null default '',
  logo_url      text not null default '/risa-logo.png',
  favicon_url   text not null default '/favicon.ico',
  color_accent  text not null default '#1B4DFF',
  color_ink     text not null default '#0A0A0B',
  radius        text not null default '10px',
  address_th    text not null default '',
  address_en    text not null default '',
  phone         text not null default '',
  email         text not null default '',
  line_id       text not null default '',
  facebook_url  text not null default '',
  x_url         text not null default '',
  youtube_url   text not null default '',
  linkedin_url  text not null default '',
  map_lat       double precision not null default 13.7563,
  map_lng       double precision not null default 100.5018,
  map_zoom      int not null default 15,
  ga_id         text not null default '',
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------- content blocks (layer 1)
create table if not exists content_blocks (
  key        text primary key,
  page       text not null,
  section    text not null,
  label      text not null,
  type       text not null default 'text'
             check (type in ('text','richtext','image','url','number','icon')),
  value_th   text not null default '',
  value_en   text not null default '',
  sort       int  not null default 0,
  updated_at timestamptz not null default now(),
  updated_by text
);
create index if not exists content_blocks_page_idx on content_blocks (page, section, sort);

-- ------------------------------------------------------------- admin users
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  name          text not null default '',
  role          text not null default 'editor' check (role in ('admin','editor')),
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);

-- ------------------------------------------------------------------- media
create table if not exists media (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  path       text not null,
  filename   text not null default '',
  alt_th     text not null default '',
  alt_en     text not null default '',
  mime       text not null default '',
  width      int,
  height     int,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------- collections
create table if not exists news (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title_th     text not null default '', title_en   text not null default '',
  excerpt_th   text not null default '', excerpt_en text not null default '',
  body_th      text not null default '', body_en    text not null default '',
  cover_url    text not null default '',
  tags         text[] not null default '{}',
  published_at date not null default current_date,
  status       text not null default 'draft' check (status in ('draft','published')),
  sort         int  not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists activities (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title_th     text not null default '', title_en   text not null default '',
  excerpt_th   text not null default '', excerpt_en text not null default '',
  body_th      text not null default '', body_en    text not null default '',
  cover_url    text not null default '',
  start_date   date,
  end_date     date,
  venue_th     text not null default '', venue_en   text not null default '',
  register_url text not null default '',
  status       text not null default 'draft' check (status in ('draft','published')),
  sort         int  not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists committee_members (
  id          uuid primary key default gen_random_uuid(),
  name_th     text not null default '', name_en     text not null default '',
  position_th text not null default '', position_en text not null default '',
  org_th      text not null default '', org_en      text not null default '',
  bio_th      text not null default '', bio_en      text not null default '',
  photo_url   text not null default '',
  group_key   text not null default 'committee'
              check (group_key in ('president','committee','advisor')),
  term        text not null default '',
  email       text not null default '',
  status      text not null default 'published' check (status in ('draft','published')),
  sort        int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists timeline_events (
  id         uuid primary key default gen_random_uuid(),
  year_th    text not null default '', year_en  text not null default '',
  title_th   text not null default '', title_en text not null default '',
  body_th    text not null default '', body_en  text not null default '',
  status     text not null default 'published' check (status in ('draft','published')),
  sort       int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists stats (
  id         uuid primary key default gen_random_uuid(),
  value      text not null default '0',
  suffix     text not null default '+',
  label_th   text not null default '', label_en text not null default '',
  status     text not null default 'published' check (status in ('draft','published')),
  sort       int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_cards (
  id         uuid primary key default gen_random_uuid(),
  icon       text not null default 'Sparkles',
  title_th   text not null default '', title_en text not null default '',
  body_th    text not null default '', body_en  text not null default '',
  href       text not null default '',
  status     text not null default 'published' check (status in ('draft','published')),
  sort       int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists research_items (
  id          uuid primary key default gen_random_uuid(),
  title_th    text not null default '', title_en    text not null default '',
  authors     text not null default '',
  venue_th    text not null default '', venue_en    text not null default '',
  abstract_th text not null default '', abstract_en text not null default '',
  year        int  not null default extract(year from now())::int,
  doi         text not null default '',
  pdf_url     text not null default '',
  tags        text[] not null default '{}',
  status      text not null default 'draft' check (status in ('draft','published')),
  sort        int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists awards (
  id           uuid primary key default gen_random_uuid(),
  year         int  not null default extract(year from now())::int,
  category_th  text not null default '', category_en  text not null default '',
  recipient_th text not null default '', recipient_en text not null default '',
  citation_th  text not null default '', citation_en  text not null default '',
  photo_url    text not null default '',
  status       text not null default 'draft' check (status in ('draft','published')),
  sort         int  not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists job_posts (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title_th       text not null default '', title_en       text not null default '',
  org_th         text not null default '', org_en         text not null default '',
  location_th    text not null default '', location_en    text not null default '',
  description_th text not null default '', description_en text not null default '',
  employment_type text not null default 'full_time',
  salary_range   text not null default '',
  deadline       date,
  apply_url      text not null default '',
  status         text not null default 'draft' check (status in ('draft','published')),
  sort           int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists gallery_albums (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title_th       text not null default '', title_en       text not null default '',
  description_th text not null default '', description_en text not null default '',
  cover_url      text not null default '',
  event_date     date,
  status         text not null default 'draft' check (status in ('draft','published')),
  sort           int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists gallery_photos (
  id         uuid primary key default gen_random_uuid(),
  album_id   uuid not null references gallery_albums(id) on delete cascade,
  image_url  text not null default '',
  caption_th text not null default '', caption_en text not null default '',
  sort       int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists gallery_photos_album_idx on gallery_photos (album_id, sort);

create table if not exists documents (
  id             uuid primary key default gen_random_uuid(),
  title_th       text not null default '', title_en       text not null default '',
  description_th text not null default '', description_en text not null default '',
  category_th    text not null default '', category_en    text not null default '',
  file_url       text not null default '',
  mime           text not null default '',
  size_bytes     bigint,
  download_count int not null default 0,
  status         text not null default 'draft' check (status in ('draft','published')),
  sort           int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists locations (
  id         uuid primary key default gen_random_uuid(),
  name_th    text not null default '', name_en    text not null default '',
  address_th text not null default '', address_en text not null default '',
  lat        double precision not null default 13.7563,
  lng        double precision not null default 100.5018,
  kind       text not null default 'partner'
             check (kind in ('office','branch','partner','member')),
  url        text not null default '',
  status     text not null default 'published' check (status in ('draft','published')),
  sort       int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists partners (
  id         uuid primary key default gen_random_uuid(),
  name       text not null default '',
  logo_url   text not null default '',
  url        text not null default '',
  status     text not null default 'published' check (status in ('draft','published')),
  sort       int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------- navigation
create table if not exists nav_items (
  id         uuid primary key default gen_random_uuid(),
  label_th   text not null default '', label_en text not null default '',
  href       text not null default '',
  parent_id  uuid references nav_items(id) on delete cascade,
  new_tab    boolean not null default false,
  status     text not null default 'published' check (status in ('draft','published')),
  sort       int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists footer_links (
  id         uuid primary key default gen_random_uuid(),
  column_key text not null default 'menu',
  label_th   text not null default '', label_en text not null default '',
  href       text not null default '',
  new_tab    boolean not null default false,
  status     text not null default 'published' check (status in ('draft','published')),
  sort       int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------ submissions
create table if not exists submissions (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('contact','membership','job')),
  name       text not null default '',
  email      text not null default '',
  subject    text not null default '',
  payload    jsonb not null default '{}'::jsonb,
  status     text not null default 'new' check (status in ('new','read','archived')),
  notes      text not null default '',
  ip         text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists submissions_kind_idx on submissions (kind, created_at desc);

-- -------------------------------------------------------------- audit log
create table if not exists audit_log (
  id          bigserial primary key,
  actor_email text not null default '',
  action      text not null,
  entity      text not null,
  entity_id   text not null default '',
  before      jsonb,
  after       jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists audit_log_created_idx on audit_log (created_at desc);

-- ------------------------------------------------------- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array[
    'settings','content_blocks','news','activities','committee_members',
    'timeline_events','stats','service_cards','research_items','awards',
    'job_posts','gallery_albums','gallery_photos','documents','locations',
    'partners','nav_items','footer_links'
  ] loop
    execute format('drop trigger if exists %I on %I', t || '_set_updated_at', t);
    execute format(
      'create trigger %I before update on %I for each row execute function set_updated_at()',
      t || '_set_updated_at', t);
  end loop;
end $$;
