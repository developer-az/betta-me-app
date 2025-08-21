import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tanks: {
        Row: {
          id: string;
          user_id: string;
          size: number;
          heater: boolean;
          filter: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          size: number;
          heater: boolean;
          filter: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          size?: number;
          heater?: boolean;
          filter?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      fish: {
        Row: {
          id: string;
          user_id: string;
          tank_id: string;
          name: string;
          color: string;
          appetite: string;
          activity: string;
          fin_condition: string;
          color_condition: string;
          gill_condition: string;
          body_condition: string;
          behavior: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tank_id: string;
          name: string;
          color: string;
          appetite: string;
          activity: string;
          fin_condition: string;
          color_condition: string;
          gill_condition: string;
          body_condition: string;
          behavior: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tank_id?: string;
          name?: string;
          color?: string;
          appetite?: string;
          activity?: string;
          fin_condition?: string;
          color_condition?: string;
          gill_condition?: string;
          body_condition?: string;
          behavior?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      water_readings: {
        Row: {
          id: string;
          user_id: string;
          tank_id: string;
          temperature: number;
          ph: number;
          ammonia: number;
          nitrite: number;
          nitrate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tank_id: string;
          temperature: number;
          ph: number;
          ammonia: number;
          nitrite: number;
          nitrate: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tank_id?: string;
          temperature?: number;
          ph?: number;
          ammonia?: number;
          nitrite?: number;
          nitrate?: number;
          created_at?: string;
        };
      };
    };
  };
}
