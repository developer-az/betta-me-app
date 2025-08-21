-- Quick RLS Fix for 406 Errors
-- This script specifically targets the tanks and fish SELECT policies

-- First, let's see what policies exist
SELECT 
  tablename, 
  policyname, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename IN ('tanks', 'fish') 
ORDER BY tablename, policyname;

-- Drop the problematic SELECT policies
DROP POLICY IF EXISTS "Users can view own tanks" ON tanks;
DROP POLICY IF EXISTS "Users can view own fish" ON fish;

-- Recreate them with proper USING clauses
CREATE POLICY "Users can view own tanks" ON tanks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own fish" ON fish
  FOR SELECT
  USING (auth.uid() = user_id);

-- Verify the fix
SELECT 
  tablename, 
  policyname, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename IN ('tanks', 'fish') 
  AND cmd = 'SELECT'
ORDER BY tablename;

-- Test if we can query the tables (this should work for authenticated users)
SELECT 'tanks' as table_name, COUNT(*) as row_count FROM tanks WHERE user_id = '8234e553-0f87-4f2b-b057-6b01a3581153'
UNION ALL
SELECT 'fish' as table_name, COUNT(*) as row_count FROM fish WHERE user_id = '8234e553-0f87-4f2b-b057-6b01a3581153';
