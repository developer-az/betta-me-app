-- Comprehensive RLS Fix for Betta App
-- This script fixes all RLS policies that might be causing 406 errors

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_readings ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own tanks" ON tanks;
DROP POLICY IF EXISTS "Users can insert own tanks" ON tanks;
DROP POLICY IF EXISTS "Users can update own tanks" ON tanks;
DROP POLICY IF EXISTS "Users can delete own tanks" ON tanks;

DROP POLICY IF EXISTS "Users can view own fish" ON fish;
DROP POLICY IF EXISTS "Users can insert own fish" ON fish;
DROP POLICY IF EXISTS "Users can update own fish" ON fish;
DROP POLICY IF EXISTS "Users can delete own fish" ON fish;

DROP POLICY IF EXISTS "Users can view own water readings" ON water_readings;
DROP POLICY IF EXISTS "Users can insert own water readings" ON water_readings;
DROP POLICY IF EXISTS "Users can update own water readings" ON water_readings;
DROP POLICY IF EXISTS "Users can delete own water readings" ON water_readings;

-- Create profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create tanks policies
CREATE POLICY "Users can view own tanks" ON tanks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tanks" ON tanks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tanks" ON tanks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tanks" ON tanks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create fish policies
CREATE POLICY "Users can view own fish" ON fish
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fish" ON fish
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fish" ON fish
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fish" ON fish
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create water_readings policies
CREATE POLICY "Users can view own water readings" ON water_readings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water readings" ON water_readings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own water readings" ON water_readings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own water readings" ON water_readings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Verify all policies were created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename IN ('profiles', 'tanks', 'fish', 'water_readings')
ORDER BY tablename, policyname;
