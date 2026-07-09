-- 1. Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users not null primary key,
  role text not null check (role in ('super_admin', 'manager', 'worker')),
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Automatically create a profile when a new user is created in Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'worker'); -- Defaults to worker, you can change it in the dashboard
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
