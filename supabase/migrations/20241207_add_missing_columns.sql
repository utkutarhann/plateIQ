-- Add body_type column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'body_type') THEN
        ALTER TABLE public.user_profiles ADD COLUMN body_type text check (body_type in ('ectomorph', 'mesomorph', 'endomorph'));
    END IF;
END $$;

-- Add daily macro goals if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'daily_protein_goal') THEN
        ALTER TABLE public.user_profiles ADD COLUMN daily_protein_goal numeric;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'daily_carbs_goal') THEN
        ALTER TABLE public.user_profiles ADD COLUMN daily_carbs_goal numeric;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'daily_fat_goal') THEN
        ALTER TABLE public.user_profiles ADD COLUMN daily_fat_goal numeric;
    END IF;
END $$;

-- Add streak columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'current_streak') THEN
        ALTER TABLE public.user_profiles ADD COLUMN current_streak integer default 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'longest_streak') THEN
        ALTER TABLE public.user_profiles ADD COLUMN longest_streak integer default 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'last_log_date') THEN
        ALTER TABLE public.user_profiles ADD COLUMN last_log_date date;
    END IF;
END $$;
