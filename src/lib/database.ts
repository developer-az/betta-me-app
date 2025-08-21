import { supabase } from './supabase';
import { TankState, FishState, WaterState } from '../types';

// Tank operations
export const tankService = {
  // Get user's tank
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

  // Save tank data (create new record like water_readings)
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

  // Update tank data
  async updateTank(tankId: string, tankData: Partial<TankState>) {
    const { data, error } = await supabase
      .from('tanks')
      .update(tankData)
      .eq('id', tankId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Fish operations
export const fishService = {
  // Get user's fish
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

  // Save fish data (create new record like water_readings)
  async saveFish(userId: string, tankId: string, fishData: FishState) {
    const { data, error } = await supabase
      .from('fish')
      .insert({
        user_id: userId,
        tank_id: tankId,
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

  // Update fish data
  async updateFish(fishId: string, fishData: Partial<FishState>) {
    const { data, error } = await supabase
      .from('fish')
      .update(fishData)
      .eq('id', fishId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Water operations
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
  async saveWaterReading(userId: string, tankId: string, waterData: WaterState) {
    const { data, error } = await supabase
      .from('water_readings')
      .insert({
        user_id: userId,
        tank_id: tankId,
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
