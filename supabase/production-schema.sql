-- Betta Me production schema (single source of truth)
-- Run in Supabase SQL editor on a fresh project, or migrate carefully on existing ones.
-- Model: tanks / fish / water_readings are append-only logs (latest row wins in the app).
-- feeding_logs / water_changes reference a tank_id from the latest tanks row.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  plan_id TEXT NOT NULL DEFAULT 'free' CHECK (plan_id IN ('free', 'pro', 'care')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tanks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  size INTEGER NOT NULL CHECK (size > 0 AND size <= 500),
  heater BOOLEAN NOT NULL DEFAULT false,
  filter BOOLEAN NOT NULL DEFAULT false,
  name TEXT DEFAULT 'Primary habitat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fish (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  appetite TEXT NOT NULL,
  activity TEXT NOT NULL,
  fin_condition TEXT NOT NULL,
  color_condition TEXT NOT NULL,
  gill_condition TEXT NOT NULL,
  body_condition TEXT NOT NULL,
  behavior TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS water_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  temperature NUMERIC(4,1) NOT NULL CHECK (temperature BETWEEN 32 AND 110),
  ph NUMERIC(3,1) NOT NULL CHECK (ph BETWEEN 0 AND 14),
  ammonia NUMERIC(5,2) NOT NULL CHECK (ammonia >= 0),
  nitrite NUMERIC(5,2) NOT NULL CHECK (nitrite >= 0),
  nitrate NUMERIC(5,2) NOT NULL CHECK (nitrate >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feeding_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tank_id UUID NOT NULL REFERENCES tanks(id) ON DELETE CASCADE,
  food_type TEXT NOT NULL,
  amount TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS water_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tank_id UUID NOT NULL REFERENCES tanks(id) ON DELETE CASCADE,
  percentage INTEGER NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  temperature_unit TEXT NOT NULL DEFAULT 'fahrenheit' CHECK (temperature_unit IN ('fahrenheit', 'celsius')),
  theme TEXT NOT NULL DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
  health_alerts BOOLEAN NOT NULL DEFAULT true,
  water_reminders BOOLEAN NOT NULL DEFAULT true,
  feeding_reminders BOOLEAN NOT NULL DEFAULT true,
  analytics BOOLEAN NOT NULL DEFAULT false,
  data_sharing BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminder_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_key TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, reminder_key, completed_at)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_tanks_user_created ON tanks (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fish_user_created ON fish (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_water_user_created ON water_readings (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feeding_user_created ON feeding_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_water_changes_user_created ON water_changes (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reminder_completions_user ON reminder_completions (user_id, reminder_key, completed_at DESC);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_completions ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles','tanks','fish','water_readings','feeding_logs',
    'water_changes','user_settings','reminder_completions'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "own_select" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "own_insert" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "own_update" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "own_delete" ON %I', t);
  END LOOP;
END $$;

-- profiles (id = auth.uid)
CREATE POLICY "own_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- user-owned tables
CREATE POLICY "own_select" ON tanks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_insert" ON tanks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_update" ON tanks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_delete" ON tanks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_select" ON fish FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_insert" ON fish FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_update" ON fish FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_delete" ON fish FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_select" ON water_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_insert" ON water_readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_update" ON water_readings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_delete" ON water_readings FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_select" ON feeding_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_insert" ON feeding_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_update" ON feeding_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_delete" ON feeding_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_select" ON water_changes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_insert" ON water_changes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_update" ON water_changes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_delete" ON water_changes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_select" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_insert" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_update" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "own_select" ON reminder_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_insert" ON reminder_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_delete" ON reminder_completions FOR DELETE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW();

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
