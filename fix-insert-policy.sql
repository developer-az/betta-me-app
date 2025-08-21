-- Fix the INSERT policy for profiles table
-- The current policy has qual: null which is causing the database error

-- First, let's see what's wrong with the current policy
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles' AND cmd = 'INSERT';

-- Drop the problematic policy completely
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new INSERT policy with proper WITH CHECK clause
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Verify the fix
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles' AND cmd = 'INSERT';

-- Also check all profiles policies to make sure they're correct
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd;
