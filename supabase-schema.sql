-- Quietly — Supabase Schema
-- Run this in the Supabase SQL Editor

-- Profiles table (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  resume jsonb,
  blocked_employers text[] default '{}',
  salary_floor integer default 0,
  preferences jsonb default '{}',
  onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Messages table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Applications table
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  job jsonb not null,
  status text not null default 'saved' check (status in ('saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn')),
  notes text default '',
  applied_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_messages_user on messages(user_id);
create index if not exists idx_applications_user on applications(user_id);

-- Row Level Security
alter table profiles enable row level security;
alter table messages enable row level security;
alter table applications enable row level security;

-- Policies: users can only access their own data
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can view own messages" on messages
  for select using (auth.uid() = user_id);
create policy "Users can insert own messages" on messages
  for insert with check (auth.uid() = user_id);

create policy "Users can view own applications" on applications
  for select using (auth.uid() = user_id);
create policy "Users can insert own applications" on applications
  for insert with check (auth.uid() = user_id);
create policy "Users can update own applications" on applications
  for update using (auth.uid() = user_id);
create policy "Users can delete own applications" on applications
  for delete using (auth.uid() = user_id);
