-- Drop existing table if it exists
drop table if exists public.check_ins;

-- Create the check_ins table with correct schema
create table public.check_ins (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  badge_number text not null,
  title text not null,
  investigative_role text not null,
  department_number text not null,
  defendant_name text not null,
  phone_number text,
  case_number text,
  additional_comments text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  verified boolean default false not null,
  flagged boolean default false not null
);

-- Set up row level security (RLS)
alter table public.check_ins enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.check_ins
  for select using (true);

create policy "Enable insert access for all users" on public.check_ins
  for insert with check (true);

create policy "Enable update access for all users" on public.check_ins
  for update using (true);

-- Create indexes for better query performance
create index check_ins_created_at_idx on public.check_ins (created_at desc);
create index check_ins_badge_number_idx on public.check_ins (badge_number);