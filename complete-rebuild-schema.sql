-- Complete Rebuild: Treat tanks and fish like water_readings
-- This creates a completely new approach where everything is append-only

-- Drop existing tables completely
DROP TABLE IF EXISTS water_readings CASCADE;
DROP TABLE IF EXISTS fish CASCADE;
DROP TABLE IF EXISTS tanks CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tanks table - TREAT LIKE WATER_READINGS (append-only log)
CREATE TABLE tanks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  size INTEGER NOT NULL CHECK (size > 0),
  heater BOOLEAN DEFAULT false,
  filter BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fish table - TREAT LIKE WATER_READINGS (append-only log)
CREATE TABLE fish (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  appetite TEXT NOT NULL,
  activity TEXT NOT NULL,
  fin_condition TEXT NOT NULL,
  color_condition TEXT NOT NULL,
  gill_condition TEXT NOT NULL,
  body_condition TEXT NOT NULL,
  behavior TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create water_readings table (keep as is since it works)
CREATE TABLE water_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  temperature DECIMAL(4,1) NOT NULL,
  ph DECIMAL(3,1) NOT NULL,
  ammonia DECIMAL(4,2) NOT NULL,
  nitrite DECIMAL(4,2) NOT NULL,
  nitrate DECIMAL(4,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_readings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for tanks (EXACTLY like water_readings)
CREATE POLICY "Users can view own tanks" ON tanks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tanks" ON tanks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for fish (EXACTLY like water_readings)
CREATE POLICY "Users can view own fish" ON fish
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fish" ON fish
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for water_readings (keep as is)
CREATE POLICY "Users can view own water readings" ON water_readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water readings" ON water_readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger function for profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  SET search_path = '';
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  SET search_path = '';
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
