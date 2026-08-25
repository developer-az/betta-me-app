import { supabase } from './supabase';
import { TankState, FishState, WaterState, FeedingLog, WaterChange, FeedingLogForm, WaterChangeForm } from '../types';

function rethrow(error: any, action: string): never {
  const message = error?.message || 'Unknown database error';
  const enriched = new Error(`${action}: ${message}`);
  (enriched as any).code = error?.code;
  (enriched as any).details = error?.details;
  throw enriched;
}

export const tankService = {
  async getTank(userId: string) {
    const { data, error } = await supabase
      .from('tanks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) rethrow(error, 'Load tank');
    return data;
  },

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

    if (error) rethrow(error, 'Save tank');
    return data;
  },

  async getTankHistory(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('tanks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) rethrow(error, 'Load tank history');
    return data || [];
  },
};

export const fishService = {
  async getFish(userId: string) {
    const { data, error } = await supabase
      .from('fish')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) rethrow(error, 'Load fish');
    return data;
  },

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

    if (error) rethrow(error, 'Save fish');
    return data;
  },

  async getFishHistory(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('fish')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) rethrow(error, 'Load fish history');
    return data || [];
  },
};

export const waterService = {
  async getLatestWaterReading(userId: string) {
    const { data, error } = await supabase
      .from('water_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) rethrow(error, 'Load water reading');
    return data;
  },

  async saveWaterReading(userId: string, waterData: WaterState, notes?: string) {
    const { data, error } = await supabase
      .from('water_readings')
      .insert({
        user_id: userId,
        temperature: waterData.temperature,
        ph: waterData.pH,
        ammonia: waterData.ammonia,
        nitrite: waterData.nitrite,
        nitrate: waterData.nitrate,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) rethrow(error, 'Save water reading');
    return data;
  },

  async getWaterHistory(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('water_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) rethrow(error, 'Load water history');
    return data || [];
  },
};

export const getOrCreateTankId = async (userId: string, tankData: TankState) => {
  let tank = await tankService.getTank(userId);
  if (!tank) {
    tank = await tankService.saveTank(userId, tankData);
  }
  return tank.id as string;
};

export const feedingLogService = {
  async getFeedingLogs(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('feeding_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) rethrow(error, 'Load feeding logs');
    return (data || []) as FeedingLog[];
  },

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

    if (error) rethrow(error, 'Save feeding log');
    return data as FeedingLog;
  },

  async deleteFeedingLog(userId: string, id: string) {
    const { error } = await supabase
      .from('feeding_logs')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);

    if (error) rethrow(error, 'Delete feeding log');
  },

  async getFeedingStats(userId: string, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('feeding_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString());

    if (error) rethrow(error, 'Load feeding stats');
    return (data || []) as FeedingLog[];
  },
};

export const waterChangeService = {
  async getWaterChanges(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('water_changes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) rethrow(error, 'Load water changes');
    return (data || []) as WaterChange[];
  },

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

    if (error) rethrow(error, 'Save water change');
    return data as WaterChange;
  },

  async deleteWaterChange(userId: string, id: string) {
    const { error } = await supabase
      .from('water_changes')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);

    if (error) rethrow(error, 'Delete water change');
  },

  async getWaterChangeStats(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('water_changes')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString());

    if (error) rethrow(error, 'Load water-change stats');
    return (data || []) as WaterChange[];
  },

  async getLastWaterChange(userId: string) {
    const { data, error } = await supabase
      .from('water_changes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) rethrow(error, 'Load last water change');
    return data as WaterChange | null;
  },
};

export const settingsService = {
  async getSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) rethrow(error, 'Load settings');
    return data;
  },

  async upsertSettings(userId: string, patch: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ user_id: userId, ...patch, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) rethrow(error, 'Save settings');
    return data;
  },
};
