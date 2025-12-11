-- Create challenges table
create table public.challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  target_count integer default 1,
  unit text, -- e.g., 'times', 'liters', 'meals'
  reward text, -- e.g., '🏆', '💧'
  type text default 'daily' check (type in ('daily', 'weekly')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_challenges table to track progress
create table public.user_challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  challenge_id uuid references public.challenges(id) not null,
  progress integer default 0,
  completed boolean default false,
  date date default current_date, -- To track daily progress
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, challenge_id, date) -- One entry per challenge per user per day
);

-- Enable RLS
alter table public.challenges enable row level security;
alter table public.user_challenges enable row level security;

-- Policies
create policy "Challenges are viewable by everyone" on public.challenges
  for select using (true);

create policy "Users can view their own challenge progress" on public.user_challenges
  for select using (auth.uid() = user_id);

create policy "Users can insert their own challenge progress" on public.user_challenges
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own challenge progress" on public.user_challenges
  for update using (auth.uid() = user_id);

-- Insert default challenges
insert into public.challenges (title, description, target_count, unit, reward, type) values
('Su İç', 'Bugün 2 litre su iç.', 2, 'litre', '💧', 'daily'),
('Sebze Ye', 'Bir öğününde sebze bulundur.', 1, 'öğün', '🥦', 'daily'),
('Yürüyüş Yap', '30 dakika yürüyüş yap.', 1, 'kez', '🚶', 'daily'),
('Şekersiz Gün', 'Bugün hiç şekerli gıda tüketme.', 1, 'gün', '🚫', 'daily'),
('Protein Hedefi', 'Günlük protein hedefini tuttur.', 1, 'gün', '🥩', 'daily');
