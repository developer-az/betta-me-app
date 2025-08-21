-- Fix RLS Policies for Profiles Table
-- This fixes the INSERT policy that's causing "Database error updating user"

-- Drop the problematic INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create the correct INSERT policy
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Also fix the trigger function to work with RLS
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
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

-- Verify the fix by checking the policies
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd;
