-- Datenbank der Lern-App. Einmal im Supabase SQL Editor einfügen und "Run" klicken.
-- Jede Zeile gehört genau einer Person (user_id). Die Zugriffsregeln (RLS) sorgen dafür,
-- dass jede Person nur ihre eigenen Zeilen sehen und ändern kann.

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null,
  short text not null default '',
  color text not null default 'blau',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists course_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  course_id uuid not null references courses on delete cascade,
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  course_id uuid references courses on delete set null,
  title text not null,
  date date not null,
  kind text not null default 'pruefung' check (kind in ('pruefung', 'abgabe', 'frist')),
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists study_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  course_id uuid references courses on delete set null,
  title text not null,
  date date not null,
  start text not null default '09:00',
  "end" text not null default '10:00',
  done boolean not null default false,
  created_at timestamptz not null default now()
);

-- Zugriffsregeln: nur eigene Zeilen, nur angemeldet.
do $$
declare t text;
begin
  foreach t in array array['courses', 'course_links', 'exams', 'study_blocks'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "eigene zeilen" on %I', t);
    execute format('create policy "eigene zeilen" on %I for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t);
    execute format('revoke all on %I from anon', t);
    execute format('grant select, insert, update, delete on %I to authenticated', t);
  end loop;
end $$;

-- Prüfabfrage (danach separat ausführen): alle vier Tabellen müssen rls = true, regeln = 1, anon_darf_lesen = false zeigen.
-- select c.relname as tabelle, c.relrowsecurity as rls,
--   (select count(*) from pg_policies p where p.tablename = c.relname) as regeln,
--   has_table_privilege('anon', c.oid, 'select') as anon_darf_lesen
-- from pg_class c join pg_namespace n on n.oid = c.relnamespace
-- where n.nspname = 'public' and c.relname in ('courses', 'course_links', 'exams', 'study_blocks');
