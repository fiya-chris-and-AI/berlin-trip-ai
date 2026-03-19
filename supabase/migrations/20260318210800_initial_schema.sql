-- Berlin Companion — Initial Schema
-- Tables for real-time sync between Fiya and Chris

-- Users (simple invite-code auth, no passwords)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('fiya', 'chris')),
  invite_code text unique,
  created_at timestamptz default now()
);

-- Shared messages between Fiya and Chris
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender text not null check (sender in ('fiya', 'chris')),
  content text not null,
  type text not null default 'text' check (type in ('text', 'emoji', 'ping', 'mood')),
  created_at timestamptz default now()
);

-- Per-day notes (synced)
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  day integer not null check (day >= 19 and day <= 27),
  author text not null check (author in ('fiya', 'chris')),
  content text default '',
  updated_at timestamptz default now(),
  unique (day, author)
);

-- Checklist state (synced)
create table if not exists checklist (
  id uuid primary key default gen_random_uuid(),
  item_key text not null unique,
  checked boolean default false,
  checked_by text check (checked_by in ('fiya', 'chris')),
  checked_at timestamptz
);

-- Explore favorites (synced)
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  spot_name text not null,
  added_by text not null check (added_by in ('fiya', 'chris')),
  created_at timestamptz default now(),
  unique (spot_name, added_by)
);

-- Enable realtime for all tables
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table notes;
alter publication supabase_realtime add table checklist;
alter publication supabase_realtime add table favorites;

-- Seed: insert initial users
insert into users (name, role, invite_code)
values
  ('Lutfiya Miller', 'fiya', 'FIYA2026'),
  ('Chris Müller', 'chris', 'CHRIS2026')
on conflict (invite_code) do nothing;

-- RLS: allow authenticated + anon for now (simple app, no auth)
alter table users enable row level security;
alter table messages enable row level security;
alter table notes enable row level security;
alter table checklist enable row level security;
alter table favorites enable row level security;

create policy "Allow all on users" on users for all using (true);
create policy "Allow all on messages" on messages for all using (true);
create policy "Allow all on notes" on notes for all using (true);
create policy "Allow all on checklist" on checklist for all using (true);
create policy "Allow all on favorites" on favorites for all using (true);
