-- Row Level Security.
--
-- The app's real security boundary is the Next.js server: the database
-- credentials never leave it, public pages read through server components and
-- every write goes through a server action that calls requireUser(). These
-- policies are belt-and-braces for a Supabase deployment, where a publishable
-- anon key reaches the browser and can talk to PostgREST directly.
--
-- Guarded so the file is a no-op on a plain local Postgres, which has no
-- `anon` / `authenticated` roles.
do $$
declare
  t text;
  public_read text[] := array[
    'settings','content_blocks','news','activities','committee_members',
    'timeline_events','stats','service_cards','research_items','awards',
    'job_posts','gallery_albums','gallery_photos','documents','locations',
    'partners','nav_items','footer_links','list_items','media'
  ];
  locked text[] := array['admin_users','submissions','audit_log'];
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    raise notice 'RLS skipped: no `anon` role (not a Supabase database).';
    return;
  end if;

  -- Readable by anyone, but only rows that are published.
  foreach t in array public_read loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_public_read', t);
    if exists (
      select 1 from information_schema.columns
      where table_name = t and column_name = 'status'
    ) then
      execute format(
        'create policy %I on %I for select to anon, authenticated using (status = ''published'')',
        t || '_public_read', t);
    else
      execute format(
        'create policy %I on %I for select to anon, authenticated using (true)',
        t || '_public_read', t);
    end if;
  end loop;

  -- Never reachable with the anon key; the server uses the service role.
  foreach t in array locked loop
    execute format('alter table %I enable row level security', t);
  end loop;

  -- The one exception: anyone may file a contact / membership / job form,
  -- and nobody may read those rows back.
  execute 'drop policy if exists submissions_anon_insert on submissions';
  execute 'create policy submissions_anon_insert on submissions
             for insert to anon, authenticated with check (true)';
end $$;
