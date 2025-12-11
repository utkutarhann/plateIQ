-- Create weight_logs table
create table public.weight_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  weight numeric not null,
  note text,
  date date default CURRENT_DATE not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.weight_logs enable row level security;

-- Policies
create policy "Users can view their own weight logs" on public.weight_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own weight logs" on public.weight_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own weight logs" on public.weight_logs
  for update using (auth.uid() = user_id);

create policy "Users can delete their own weight logs" on public.weight_logs
  for delete using (auth.uid() = user_id);
