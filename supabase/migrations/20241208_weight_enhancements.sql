-- Add target_weight to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS target_weight numeric;

-- Add note to weight_logs
ALTER TABLE public.weight_logs
ADD COLUMN IF NOT EXISTS note text;

-- Create body_measurements table
CREATE TABLE IF NOT EXISTS public.body_measurements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    waist numeric, -- Bel
    hips numeric, -- Kalça
    chest numeric, -- Göğüs
    neck numeric, -- Boyun
    thigh numeric, -- Bacak/Uyluk
    bicep numeric, -- Kol/Pazı
    note text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for body_measurements
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

-- Policies for body_measurements
CREATE POLICY "Users can view their own measurements" ON public.body_measurements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own measurements" ON public.body_measurements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own measurements" ON public.body_measurements
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own measurements" ON public.body_measurements
    FOR DELETE USING (auth.uid() = user_id);
