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
