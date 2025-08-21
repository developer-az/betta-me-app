-- Quick Fix for Database Issues
-- Run this if you're getting "Database error updating user"

-- Drop and recreate the handle_new_user function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set an empty search path to prevent schema leakage
  SET search_path = '';
  
  -- Insert into the public.profiles table with explicit schema qualification
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Drop and recreate the update_updated_at_column function
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set an empty search path to prevent schema leakage
  SET search_path = '';
  
  -- Update the updated_at column with current timestamp
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Recreate the triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tanks_updated_at ON tanks;
CREATE TRIGGER update_tanks_updated_at
  BEFORE UPDATE ON tanks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_fish_updated_at ON fish;
CREATE TRIGGER update_fish_updated_at
  BEFORE UPDATE ON fish
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
