import { supabase } from './supabase';
import { TankState, FishState, WaterState, FeedingLog, WaterChange, FeedingLogForm, WaterChangeForm } from '../types';

async function fetchLatestTank(userId: string) {
  const { data, error } = await supabase
    .from('tanks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function fetchLatestFish(userId: string) {
  const { data, error } = await supabase
    .from('fish')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// A habitat is one current tank per user. Water tests stay append-only.
export const tankService = {
  async getTank(userId: string) {
    return fetchLatestTank(userId);
  },

  async saveTank(userId: string, tankData: TankState) {
    const existing = await fetchLatestTank(userId);
    if (existing) {
      const { data, error } = await supabase
        .from('tanks')
        .update({
          size: tankData.size,
          heater: tankData.heater,
          filter: tankData.filter,
        })
        .eq('id', existing.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

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

export async function getOrCreateTankId(userId: string, tankData: TankState) {
  const existing = await fetchLatestTank(userId);
  if (existing?.id) return existing.id as string;

  const created = await tankService.saveTank(userId, tankData);
  if (!created?.id) throw new Error('Could not create a habitat.');
  return created.id as string;
}

export const fishService = {
  async getFish(userId: string) {
    return fetchLatestFish(userId);
  },

  async saveFish(userId: string, fishData: FishState, tankData: TankState) {
    const tankId = await getOrCreateTankId(userId, tankData);
    const existing = await fetchLatestFish(userId);
    const row = {
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
    };

    if (existing) {
      const { data, error } = await supabase
        .from('fish')
        .update(row)
        .eq('id', existing.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase
      .from('fish')
      .insert(row)
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

  async saveWaterReading(userId: string, waterData: WaterState, tankData: TankState) {
    const tankId = await getOrCreateTankId(userId, tankData);
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
