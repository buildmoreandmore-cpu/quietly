-- Quietly — AI Recruiting Agency Schema
-- Run this in the Supabase SQL Editor

-- Profiles table (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  resume jsonb,                          -- Parsed resume object
  resume_text text,                      -- Raw resume text for prompts
  target_titles text[] default '{}',     -- Job titles they want
  target_locations text[] default '{}',  -- Preferred locations
  target_industries text[] default '{}', -- Preferred industries
  blocked_employers text[] default '{}', -- Never show jobs from these
  salary_floor integer default 0,        -- Minimum salary
  job_type text default 'full-time',     -- full-time, contract, remote, etc.
  is_active boolean default true,        -- Active in the pool
  onboarded boolean default false,
  last_discovery_at timestamptz,         -- Last time cron ran for this user
  stripe_customer_id text,               -- Stripe customer ID
  stripe_subscription_id text,           -- Stripe subscription ID
  subscription_status text default 'none' check (subscription_status in ('none', 'active', 'trialing', 'past_due', 'canceled', 'unpaid')),
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Matches: jobs discovered for a candidate
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  company text not null,
  location text,
  job_type text,
  salary_range text,
  url text,
  posted_date text,
  match_score integer not null,          -- 0-100
  match_grade text not null,             -- A/B/C/D/F
  why_it_fits text,
  one_concern text,
  source text,                           -- Which job board
  status text not null default 'new' check (status in ('new', 'outreach_sent', 'responded', 'intro_made', 'passed', 'expired')),
  discovered_at timestamptz default now()
);

-- Outreach log: messages sent to hiring managers
create table if not exists outreach_log (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  hiring_manager text,                   -- Name if known
  channel text not null default 'email', -- email, linkedin, twitter
  variant text not null default 'medium',-- short, medium, warm
  subject text,
  message_body text not null,
  sent_at timestamptz,
  responded_at timestamptz,
  response_summary text,
  status text not null default 'draft' check (status in ('draft', 'sent', 'opened', 'responded', 'intro_made', 'no_response')),
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_matches_user on matches(user_id);
create index if not exists idx_matches_status on matches(status);
create index if not exists idx_outreach_match on outreach_log(match_id);
create index if not exists idx_outreach_user on outreach_log(user_id);
create index if not exists idx_outreach_status on outreach_log(status);

-- Row Level Security
alter table profiles enable row level security;
alter table matches enable row level security;
alter table outreach_log enable row level security;

-- Policies: users can only access their own data
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can view own matches" on matches;
create policy "Users can view own matches" on matches
  for select using (auth.uid() = user_id);
drop policy if exists "Service can insert matches" on matches;
create policy "Service can insert matches" on matches
  for insert with check (true);  -- Service role inserts via cron
drop policy if exists "Service can update matches" on matches;
create policy "Service can update matches" on matches
  for update using (true);

drop policy if exists "Users can view own outreach" on outreach_log;
create policy "Users can view own outreach" on outreach_log
  for select using (auth.uid() = user_id);
drop policy if exists "Service can insert outreach" on outreach_log;
create policy "Service can insert outreach" on outreach_log
  for insert with check (true);
drop policy if exists "Service can update outreach" on outreach_log;
create policy "Service can update outreach" on outreach_log
  for update using (true);
