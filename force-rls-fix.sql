-- Force RLS Fix - Complete Policy Reset
-- This script completely removes and recreates all policies for tanks and fish

-- Step 1: Disable RLS temporarily
ALTER TABLE tanks DISABLE ROW LEVEL SECURITY;
ALTER TABLE fish DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies for tanks and fish
DROP POLICY IF EXISTS "Users can view own tanks" ON tanks;
DROP POLICY IF EXISTS "Users can insert own tanks" ON tanks;
DROP POLICY IF EXISTS "Users can update own tanks" ON tanks;
DROP POLICY IF EXISTS "Users can delete own tanks" ON tanks;

DROP POLICY IF EXISTS "Users can view own fish" ON fish;
DROP POLICY IF EXISTS "Users can insert own fish" ON fish;
DROP POLICY IF EXISTS "Users can update own fish" ON fish;
DROP POLICY IF EXISTS "Users can delete own fish" ON fish;

-- Step 3: Re-enable RLS
ALTER TABLE tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies exactly like water_readings (which works)
-- Tanks policies
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

-- Fish policies
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

-- Step 5: Verify the policies were created
SELECT 
  tablename, 
  policyname, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename IN ('tanks', 'fish')
ORDER BY tablename, policyname;
