-- Debug script to check Supabase setup
-- Run this in your Supabase SQL Editor to diagnose issues

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'tanks', 'fish', 'water_readings');

-- 2. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'tanks', 'fish', 'water_readings');

-- 3. Check if policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 4. Check if trigger function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 5. Check if trigger exists
SELECT tgname, tgrelid::regclass, tgfoid::regproc 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 6. Test the trigger function manually (replace with a test UUID)
-- SELECT public.handle_new_user();

-- 7. Check profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public';

-- 8. Check if there are any existing profiles
SELECT COUNT(*) as profile_count FROM profiles;
