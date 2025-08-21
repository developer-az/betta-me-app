-- Test RLS Policies for Betta App
-- This script tests if the RLS policies are working correctly

-- 1. Check if RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('profiles', 'tanks', 'fish', 'water_readings')
ORDER BY tablename;

-- 2. List all policies for our tables
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

-- 3. Check if there are any policies with null qual (this causes 406 errors)
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'tanks', 'fish', 'water_readings')
  AND (qual IS NULL OR with_check IS NULL)
ORDER BY tablename, policyname;

-- 4. Test if we can see any data (this should work for authenticated users)
-- Note: This will only work if you're authenticated in the Supabase dashboard
SELECT 'tanks' as table_name, COUNT(*) as row_count FROM tanks
UNION ALL
SELECT 'fish' as table_name, COUNT(*) as row_count FROM fish
UNION ALL
SELECT 'water_readings' as table_name, COUNT(*) as row_count FROM water_readings
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles;

-- 5. Check table structure to ensure user_id columns exist
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'tanks', 'fish', 'water_readings')
  AND column_name IN ('id', 'user_id')
ORDER BY table_name, column_name;

-- 6. Test specific user data (replace with your actual user ID)
-- Replace '8234e553-0f87-4f2b-b057-6b01a3581153' with your actual user ID
SELECT 'tanks for user' as test, COUNT(*) as count FROM tanks WHERE user_id = '8234e553-0f87-4f2b-b057-6b01a3581153'
UNION ALL
SELECT 'fish for user' as test, COUNT(*) as count FROM fish WHERE user_id = '8234e553-0f87-4f2b-b057-6b01a3581153'
UNION ALL
SELECT 'water_readings for user' as test, COUNT(*) as count FROM water_readings WHERE user_id = '8234e553-0f87-4f2b-b057-6b01a3581153';
