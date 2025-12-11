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
