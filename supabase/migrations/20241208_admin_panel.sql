-- Create foods table
create table public.foods (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  portion_unit text default 'serving',
  portion_amount numeric default 1,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.foods enable row level security;

-- Policies for foods
-- Admins can do everything
create policy "Admins can do everything on foods" on public.foods
  for all using (
    auth.uid() in (select id from public.users where role = 'admin')
  );

-- Users can view verified foods (or all foods, depending on requirement. Let's say all for now)
create policy "Users can view foods" on public.foods
  for select using (true);

-- Update users table policies to ensure admins can view/edit all users (if not already covered)
-- (Assuming existing policies might be too restrictive, let's add admin overrides)

-- Allow admins to view all profiles
create policy "Admins can view all profiles" on public.user_profiles
  for select using (
    auth.uid() in (select id from public.users where role = 'admin')
  );

-- Allow admins to update all profiles
create policy "Admins can update all profiles" on public.user_profiles
  for update using (
    auth.uid() in (select id from public.users where role = 'admin')
  );

-- Allow admins to view all food logs
create policy "Admins can view all food logs" on public.food_logs
  for select using (
    auth.uid() in (select id from public.users where role = 'admin')
  );

-- Allow admins to update all food logs (for moderation)
create policy "Admins can update all food logs" on public.food_logs
  for update using (
    auth.uid() in (select id from public.users where role = 'admin')
  );

-- Allow admins to delete food logs (for moderation)
create policy "Admins can delete food logs" on public.food_logs
  for delete using (
    auth.uid() in (select id from public.users where role = 'admin')
  );
