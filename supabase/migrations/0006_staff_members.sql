-- Employees are separate from the governing committee. No example people are seeded.
create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  name_th text not null default '', name_en text not null default '',
  position_th text not null default '', position_en text not null default '',
  department_th text not null default '', department_en text not null default '',
  bio_th text not null default '', bio_en text not null default '',
  photo_url text not null default '',
  photo_position text not null default 'top' check (photo_position in ('top','center','bottom')),
  email text not null default '', phone text not null default '',
  status text not null default 'draft' check (status in ('draft','published')),
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists staff_members_order_idx on public.staff_members(status, sort, created_at);
alter table public.staff_members enable row level security;
-- No browser/API policies: access goes through authenticated server actions;
-- the public server component selects published rows and public fields only.
do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'staff_members_updated_at' and tgrelid = 'public.staff_members'::regclass) then
    create trigger staff_members_updated_at before update on public.staff_members
      for each row execute function set_updated_at();
  end if;
end $$;

-- Keep navigation editable through the existing menu editor.
insert into nav_items (label_th, label_en, href, parent_id, sort, status)
select 'บุคลากร', 'Our Team', '/team', parent.id,
  coalesce((select max(child.sort) + 1 from nav_items child where child.parent_id = parent.id), 0), 'published'
from nav_items parent
where parent.parent_id is null and parent.label_th = 'เกี่ยวกับสมาคม'
  and not exists (select 1 from nav_items where href = '/team')
limit 1;
