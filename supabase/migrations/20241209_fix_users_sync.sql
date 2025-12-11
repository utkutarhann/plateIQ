
-- 1. Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'user' -- Default role
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Backfill existing users
insert into public.users (id, email, full_name, avatar_url, role)
select
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url',
  'user'
from auth.users
on conflict (id) do nothing;

-- 4. Fix RLS on public.users to allow admins to view all
drop policy if exists "Admins can view all profiles" on public.users;
create policy "Admins can view all profiles" on public.users
  for select using (
    (select role from public.users where id = auth.uid()) = 'admin'
  );

-- 5. IMPORTANT: Set yourself as admin
-- Replace 'YOUR_EMAIL@gmail.com' with your actual email address
-- update public.users set role = 'admin' where email = 'YOUR_EMAIL@gmail.com';
