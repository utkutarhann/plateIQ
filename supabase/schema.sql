-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Policies for users
create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

-- Food Logs table
create table public.food_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  image_url text not null,
  food_name text not null,
  portion_size text check (portion_size in ('small', 'medium', 'large')),
  weight_grams numeric,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  corrected_by_user boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.food_logs enable row level security;

-- Policies for food_logs
create policy "Users can view their own logs" on public.food_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own logs" on public.food_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own logs" on public.food_logs
  for update using (auth.uid() = user_id);

-- Audit Logs table
create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id),
  action text not null,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.audit_logs enable row level security;

-- Only admins can view audit logs (policy to be added later or handled via service role)

-- User Profiles table
create table public.user_profiles (
  user_id uuid references public.users(id) not null primary key,
  gender text check (gender in ('male', 'female')),
  age integer,
  height numeric, -- cm
  weight numeric, -- kg
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  body_type text check (body_type in ('ectomorph', 'mesomorph', 'endomorph')),
  goal text check (goal in ('lose_weight', 'maintain', 'gain_muscle')),
  bmr numeric,
  tdee numeric,
  daily_calorie_goal numeric,
  daily_protein_goal numeric,
  daily_carbs_goal numeric,
  daily_fat_goal numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Policies for user_profiles
create policy "Users can view their own profile details" on public.user_profiles
  for select using (auth.uid() = user_id);

create policy "Users can insert their own profile details" on public.user_profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own profile details" on public.user_profiles
  for update using (auth.uid() = user_id);

-- Add streak columns to user_profiles
alter table public.user_profiles
add column current_streak integer default 0,
add column longest_streak integer default 0,
add column last_log_date date;

-- Badges table
create table public.badges (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null
);

-- User Badges table
create table public.user_badges (
  user_id uuid references public.users(id) not null,
  badge_id text references public.badges(id) not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, badge_id)
);

-- Enable RLS
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

-- Policies
create policy "Badges are viewable by everyone" on public.badges
  for select using (true);

create policy "Users can view their own earned badges" on public.user_badges
  for select using (auth.uid() = user_id);

-- Insert default badges
insert into public.badges (id, name, description, icon) values
('first_log', 'İlk Adım', 'İlk yemeğini kaydettin.', '🚀'),
('streak_3', 'İstikrar Başlıyor', '3 gün üst üste yemek kaydettin.', '🔥'),
('streak_7', 'Haftalık Seri', '7 gün üst üste yemek kaydettin.', '🏆'),
('streak_30', 'Disiplin Abidesi', '30 gün üst üste yemek kaydettin.', '👑');
