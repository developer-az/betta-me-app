// Local data management for guest mode
import { Tank, Fish, WaterReading } from '../types';

const STORAGE_KEYS = {
  tanks: 'betta-guest-tanks',
  fish: 'betta-guest-fish', 
  waterReadings: 'betta-guest-water-readings',
};

// Helper functions for localStorage operations
const getLocalData = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const setLocalData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

// Tank operations
export const localTankOperations = {
  getAll: (): Tank[] => getLocalData<Tank>(STORAGE_KEYS.tanks),
  
  create: (tank: Omit<Tank, 'id' | 'created_at' | 'updated_at'>): Tank => {
    const tanks = getLocalData<Tank>(STORAGE_KEYS.tanks);
    const newTank: Tank = {
      ...tank,
      id: `local-tank-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'guest-user',
    };
    tanks.push(newTank);
    setLocalData(STORAGE_KEYS.tanks, tanks);
    return newTank;
  },
  
  update: (id: string, updates: Partial<Tank>): Tank | null => {
    const tanks = getLocalData<Tank>(STORAGE_KEYS.tanks);
    const index = tanks.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    tanks[index] = { 
      ...tanks[index], 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    setLocalData(STORAGE_KEYS.tanks, tanks);
    return tanks[index];
  },
  
  delete: (id: string): boolean => {
    const tanks = getLocalData<Tank>(STORAGE_KEYS.tanks);
    const filtered = tanks.filter(t => t.id !== id);
    if (filtered.length === tanks.length) return false;
    setLocalData(STORAGE_KEYS.tanks, filtered);
    return true;
  },
};

// Fish operations
export const localFishOperations = {
  getAll: (): Fish[] => getLocalData<Fish>(STORAGE_KEYS.fish),
  
  getByTankId: (tankId: string): Fish[] => {
    return getLocalData<Fish>(STORAGE_KEYS.fish).filter(f => f.tank_id === tankId);
  },
  
  create: (fish: Omit<Fish, 'id' | 'created_at' | 'updated_at'>): Fish => {
    const allFish = getLocalData<Fish>(STORAGE_KEYS.fish);
    const newFish: Fish = {
      ...fish,
      id: `local-fish-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'guest-user',
    };
    allFish.push(newFish);
    setLocalData(STORAGE_KEYS.fish, allFish);
    return newFish;
  },
  
  update: (id: string, updates: Partial<Fish>): Fish | null => {
    const allFish = getLocalData<Fish>(STORAGE_KEYS.fish);
    const index = allFish.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    allFish[index] = { 
      ...allFish[index], 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    setLocalData(STORAGE_KEYS.fish, allFish);
    return allFish[index];
  },
  
  delete: (id: string): boolean => {
    const allFish = getLocalData<Fish>(STORAGE_KEYS.fish);
    const filtered = allFish.filter(f => f.id !== id);
    if (filtered.length === allFish.length) return false;
    setLocalData(STORAGE_KEYS.fish, filtered);
    return true;
  },
};

// Water reading operations
export const localWaterOperations = {
  getAll: (): WaterReading[] => getLocalData<WaterReading>(STORAGE_KEYS.waterReadings),
  
  getByTankId: (tankId: string): WaterReading[] => {
    return getLocalData<WaterReading>(STORAGE_KEYS.waterReadings)
      .filter(w => w.tank_id === tankId)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
  },
  
  create: (reading: Omit<WaterReading, 'id' | 'created_at'>): WaterReading => {
    const readings = getLocalData<WaterReading>(STORAGE_KEYS.waterReadings);
    const newReading: WaterReading = {
      ...reading,
      id: `local-reading-${Date.now()}`,
      created_at: new Date().toISOString(),
      user_id: 'guest-user',
    };
    readings.push(newReading);
    setLocalData(STORAGE_KEYS.waterReadings, readings);
    return newReading;
  },
  
  update: (id: string, updates: Partial<WaterReading>): WaterReading | null => {
    const readings = getLocalData<WaterReading>(STORAGE_KEYS.waterReadings);
    const index = readings.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    readings[index] = { ...readings[index], ...updates };
    setLocalData(STORAGE_KEYS.waterReadings, readings);
    return readings[index];
  },
  
  delete: (id: string): boolean => {
    const readings = getLocalData<WaterReading>(STORAGE_KEYS.waterReadings);
    const filtered = readings.filter(r => r.id !== id);
    if (filtered.length === readings.length) return false;
    setLocalData(STORAGE_KEYS.waterReadings, filtered);
    return true;
  },
};

// Initialize with sample data for first-time users
export const initializeSampleData = (): void => {
  const tanks = localTankOperations.getAll();
  
  if (tanks.length === 0) {
    // Create sample tank
    const sampleTank = localTankOperations.create({
      name: "My First Tank",
      size_gallons: 5.0,
      temperature_f: 78.0,
      ph: 7.0,
      setup_date: new Date().toISOString().split('T')[0],
      filter_type: "sponge",
      heater_wattage: 25,
      substrate: "gravel",
      plants: ["java_fern", "anubias"],
      decorations: ["cave", "driftwood"],
      lighting_hours: 8,
      user_id: 'guest-user',
    });

    // Create sample fish
    localFishOperations.create({
      name: "Buddy",
      tank_id: sampleTank.id,
      species: "betta_splendens",
      color: "blue",
      gender: "male",
      age_months: 6,
      size_inches: 2.5,
      acquired_date: new Date().toISOString().split('T')[0],
      health_status: "healthy",
      temperament: "friendly",
      feeding_schedule: "twice_daily",
      last_fed: new Date().toISOString(),
      user_id: 'guest-user',
    });

    // Create sample water reading
    localWaterOperations.create({
      tank_id: sampleTank.id,
      temperature_f: 78.0,
      ph: 7.0,
      ammonia_ppm: 0.0,
      nitrite_ppm: 0.0,
      nitrate_ppm: 10.0,
      recorded_at: new Date().toISOString(),
      notes: "Initial water parameters look great!",
      user_id: 'guest-user',
    });
  }
};

// Clear all local data (useful for testing or reset)
export const clearAllLocalData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Export data for potential migration to authenticated account
export const exportLocalData = () => {
  return {
    tanks: localTankOperations.getAll(),
    fish: localFishOperations.getAll(),
    waterReadings: localWaterOperations.getAll(),
    exportedAt: new Date().toISOString(),
  };
};