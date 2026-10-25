-- Additive only. Does not change columns, RLS policies, or the auth trigger.
-- Safe to run after 20240101000000_initial_schema.sql on a database that already has these tables.

CREATE INDEX IF NOT EXISTS tanks_user_id_created_at_idx
  ON public.tanks (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS fish_user_id_created_at_idx
  ON public.fish (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS water_readings_user_id_created_at_idx
  ON public.water_readings (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS feeding_logs_user_id_created_at_idx
  ON public.feeding_logs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS water_changes_user_id_created_at_idx
  ON public.water_changes (user_id, created_at DESC);

-- Realtime filters on user_id need those columns in the replica identity.
ALTER TABLE public.tanks REPLICA IDENTITY FULL;
ALTER TABLE public.fish REPLICA IDENTITY FULL;
ALTER TABLE public.water_readings REPLICA IDENTITY FULL;
ALTER TABLE public.feeding_logs REPLICA IDENTITY FULL;
ALTER TABLE public.water_changes REPLICA IDENTITY FULL;

DO $$
DECLARE
  target text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    RAISE NOTICE 'supabase_realtime publication not found; skipped';
    RETURN;
  END IF;

  FOREACH target IN ARRAY ARRAY['tanks', 'fish', 'water_readings', 'feeding_logs', 'water_changes']
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = target
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', target);
    END IF;
  END LOOP;
END $$;
