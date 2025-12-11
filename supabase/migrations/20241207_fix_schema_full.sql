-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id uuid references auth.users not null primary key,
  full_name text,
  gender text check (gender in ('male', 'female')),
  age integer,
  height numeric,
  weight numeric,
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal text check (goal in ('lose_weight', 'maintain', 'gain_muscle')),
  bmr numeric,
  tdee numeric,
  daily_calorie_goal numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist (using DO block to avoid errors if they do)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Add body_type column if it doesn't exist
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS body_type text check (body_type in ('ectomorph', 'mesomorph', 'endomorph'));

-- Add daily macro goals if they don't exist
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS daily_protein_goal numeric;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS daily_carbs_goal numeric;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS daily_fat_goal numeric;

-- Add streak columns if they don't exist
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS current_streak integer default 0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS longest_streak integer default 0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_log_date date;
