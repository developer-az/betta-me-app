-- Betta Me database diagnostics
-- Run in Supabase SQL editor. Every section should return healthy rows.

-- 1) Required tables
SELECT t AS table_name,
       CASE WHEN EXISTS (
         SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = t
       ) THEN 'ok' ELSE 'MISSING' END AS status
FROM unnest(ARRAY[
  'profiles','tanks','fish','water_readings',
  'feeding_logs','water_changes','user_settings','reminder_completions'
]) AS t;

-- 2) RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles','tanks','fish','water_readings',
    'feeding_logs','water_changes','user_settings','reminder_completions'
  )
ORDER BY tablename;

-- 3) Policies present
SELECT tablename, count(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles','tanks','fish','water_readings',
    'feeding_logs','water_changes','user_settings','reminder_completions'
  )
GROUP BY tablename
ORDER BY tablename;

-- 4) Auth trigger
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 5) Indexes
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 6) Row counts (should succeed for service role; for anon, expect RLS-filtered counts)
SELECT 'profiles' AS table_name, count(*) FROM profiles
UNION ALL SELECT 'tanks', count(*) FROM tanks
UNION ALL SELECT 'fish', count(*) FROM fish
UNION ALL SELECT 'water_readings', count(*) FROM water_readings
UNION ALL SELECT 'feeding_logs', count(*) FROM feeding_logs
UNION ALL SELECT 'water_changes', count(*) FROM water_changes;
