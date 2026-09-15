-- Move admin authentication from email addresses to human-readable usernames.
alter table admin_users add column if not exists username text;

-- Preserve existing accounts. The original seeded account becomes `smartlab`;
-- other accounts receive a stable username derived from their email address.
update admin_users
set username = case
  when lower(email) = 'admin@risa.or.th' then 'smartlab'
  else lower(regexp_replace(split_part(email, '@', 1), '[^a-z0-9_-]+', '-', 'g'))
end
where username is null or btrim(username) = '';

-- Make any historical duplicate usernames unique before enforcing the rule.
with ranked as (
  select id, username, row_number() over (partition by username order by created_at, id) as position
  from admin_users
)
update admin_users as users
set username = users.username || '-' || ranked.position
from ranked
where users.id = ranked.id and ranked.position > 1;

alter table admin_users alter column username set not null;
alter table admin_users alter column email drop not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'admin_users_username_key'
  ) then
    alter table admin_users add constraint admin_users_username_key unique (username);
  end if;
end $$;

alter table admin_users drop constraint if exists admin_users_username_format;
alter table admin_users add constraint admin_users_username_format
  check (username ~ '^[a-z0-9][a-z0-9_-]{2,31}$');
