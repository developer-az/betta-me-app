-- Fix RLS SELECT policies for tanks and fish tables
-- The 406 errors indicate that SELECT operations are being blocked by RLS

-- First, let's check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('tanks', 'fish') 
ORDER BY tablename, policyname;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own tanks" ON tanks;
DROP POLICY IF EXISTS "Users can view own fish" ON fish;

-- Create proper SELECT policies
CREATE POLICY "Users can view own tanks" ON tanks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own fish" ON fish
  FOR SELECT
  USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('tanks', 'fish') 
ORDER BY tablename, policyname;
