import { supabase } from './supabase';
import { TankState, FishState, WaterState } from '../types';

// Tank operations - TREAT EXACTLY LIKE WATER_READINGS
export const tankService = {
  // Get latest tank data (like getLatestWaterReading)
  async getTank(userId: string) {
    const { data, error } = await supabase
      .from('tanks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }
    
    return data;
  },

  // Save tank data (like saveWaterReading - always insert new record)
  async saveTank(userId: string, tankData: TankState) {
    const { data, error } = await supabase
      .from('tanks')
      .insert({
        user_id: userId,
        size: tankData.size,
        heater: tankData.heater,
        filter: tankData.filter,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get tank history (like getWaterHistory)
  async getTankHistory(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('tanks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// Fish operations - TREAT EXACTLY LIKE WATER_READINGS
export const fishService = {
  // Get latest fish data (like getLatestWaterReading)
  async getFish(userId: string) {
    const { data, error } = await supabase
      .from('fish')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  },

  // Save fish data (like saveWaterReading - always insert new record)
  async saveFish(userId: string, fishData: FishState) {
    const { data, error } = await supabase
      .from('fish')
      .insert({
        user_id: userId,
        name: fishData.name,
        color: fishData.color,
        appetite: fishData.appetite,
        activity: fishData.activity,
        fin_condition: fishData.finCondition,
        color_condition: fishData.colorCondition,
        gill_condition: fishData.gillCondition,
        body_condition: fishData.bodyCondition,
        behavior: fishData.behavior,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get fish history (like getWaterHistory)
  async getFishHistory(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('fish')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// Water operations (keep exactly as is since it works)
export const waterService = {
  // Get latest water reading
  async getLatestWaterReading(userId: string) {
    const { data, error } = await supabase
      .from('water_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  },

  // Save water reading
  async saveWaterReading(userId: string, waterData: WaterState) {
    const { data, error } = await supabase
      .from('water_readings')
      .insert({
        user_id: userId,
        temperature: waterData.temperature,
        ph: waterData.pH,
        ammonia: waterData.ammonia,
        nitrite: waterData.nitrite,
        nitrate: waterData.nitrate,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get water reading history
  async getWaterHistory(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('water_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// Helper function to get or create tank ID
export const getOrCreateTankId = async (userId: string, tankData: TankState) => {
  let tank = await tankService.getTank(userId);
  
  if (!tank) {
    tank = await tankService.saveTank(userId, tankData);
  }
  
  return tank.id;
};
