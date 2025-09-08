// UI State types
export interface TankState {
  size: number;
  heater: boolean;
  filter: boolean;
}

export interface FishState {
  name: string;
  color: string;
  appetite: string;
  activity: string;
  finCondition: string;
  colorCondition: string;
  gillCondition: string;
  bodyCondition: string;
  behavior: string;
}

export interface WaterState {
  temperature: number; // Fahrenheit
  pH: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
}

// Database types for Supabase
export interface Tank {
  id: string;
  user_id: string;
  name?: string;
  size_gallons: number;
  temperature_f?: number;
  ph?: number;
  setup_date: string;
  filter_type?: string | null;
  heater_wattage?: number | null;
  substrate?: string;
  plants?: string[];
  decorations?: string[];
  lighting_hours?: number;
  created_at: string;
  updated_at: string;
}

export interface Fish {
  id: string;
  user_id: string;
  tank_id: string;
  name: string;
  species?: string;
  color: string;
  gender?: string;
  age_months?: number;
  size_inches?: number;
  acquired_date: string;
  health_status: string;
  temperament?: string;
  feeding_schedule?: string;
  last_fed?: string;
  created_at: string;
  updated_at: string;
}

export interface WaterReading {
  id: string;
  user_id: string;
  tank_id: string;
  temperature_f: number;
  ph: number;
  ammonia_ppm: number;
  nitrite_ppm: number;
  nitrate_ppm: number;
  recorded_at: string;
  notes?: string;
  created_at: string;
}



