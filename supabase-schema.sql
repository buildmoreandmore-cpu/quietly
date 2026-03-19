-- Quietly — Supabase Schema

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  resume jsonb,
  blocked_employers text[] default '{}',
  salary_floor integer default 0,
  preferences jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  job jsonb not null,
  status text not null default 'saved' check (status in ('saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn')),
  notes text default '',
  applied_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_messages_session on messages(session_id);
create index idx_applications_session on applications(session_id);
