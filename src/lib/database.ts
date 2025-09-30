import { supabase } from './supabase';
import { TankState, FishState, WaterState, FeedingLog, WaterChange, FeedingLogForm, WaterChangeForm } from '../types';

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

// Feeding logs operations
export const feedingLogService = {
  // Get feeding logs for a user
  async getFeedingLogs(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('feeding_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as FeedingLog[];
  },

  // Save a feeding log
  async saveFeedingLog(userId: string, tankId: string, feedingData: FeedingLogForm) {
    const { data, error } = await supabase
      .from('feeding_logs')
      .insert({
        user_id: userId,
        tank_id: tankId,
        food_type: feedingData.foodType,
        amount: feedingData.amount,
        notes: feedingData.notes || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as FeedingLog;
  },

  // Get feeding stats for dashboard
  async getFeedingStats(userId: string, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    const { data, error } = await supabase
      .from('feeding_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString());
    
    if (error) throw error;
    return data as FeedingLog[];
  }
};

// Water changes operations  
export const waterChangeService = {
  // Get water changes for a user
  async getWaterChanges(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('water_changes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as WaterChange[];
  },

  // Save a water change log
  async saveWaterChange(userId: string, tankId: string, changeData: WaterChangeForm) {
    const { data, error } = await supabase
      .from('water_changes')
      .insert({
        user_id: userId,
        tank_id: tankId,
        percentage: changeData.percentage,
        notes: changeData.notes || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as WaterChange;
  },

  // Get water change stats for dashboard
  async getWaterChangeStats(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    const { data, error } = await supabase
      .from('water_changes')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString());
    
    if (error) throw error;
    return data as WaterChange[];
  },

  // Get last water change
  async getLastWaterChange(userId: string) {
    const { data, error } = await supabase
      .from('water_changes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data as WaterChange | null;
  }
};
