import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { TankState, FishState, WaterState } from '../types';
import { tankService, fishService, waterService } from '../lib/database';
import {
  localTankOperations,
  localFishOperations,
  localWaterOperations,
  initializeSampleData,
  readGuestFishProfile,
  writeGuestFishProfile,
} from '../lib/localData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DataContextType {
  tank: TankState;
  setTank: (tank: TankState) => Promise<boolean>;
  fish: FishState;
  setFish: (fish: FishState) => Promise<boolean>;
  water: WaterState;
  setWater: (water: WaterState) => Promise<boolean>;
  loading: boolean;
  isGuestMode: boolean;
  lastError: string | null;
  clearLastError: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_TANK: TankState = { size: 10, heater: true, filter: true };
const DEFAULT_FISH: FishState = {
  name: '',
  color: '#e57373',
  appetite: 'Eating well',
  activity: 'Normal',
  finCondition: 'Healthy',
  colorCondition: 'Vibrant',
  gillCondition: 'Normal',
  bodyCondition: 'Normal',
  behavior: 'Normal',
};
const DEFAULT_WATER: WaterState = { temperature: 78, pH: 7, ammonia: 0, nitrite: 0, nitrate: 10 };

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

function errorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'Could not save. Check your connection and try again.';
}

function cssColor(color: string | undefined): string {
  if (!color) return DEFAULT_FISH.color;
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  const named: Record<string, string> = {
    blue: '#2563eb',
    red: '#e11d48',
    teal: '#0d9488',
  };
  return named[color.toLowerCase()] ?? DEFAULT_FISH.color;
}

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [tank, setTankState] = React.useState<TankState>(DEFAULT_TANK);
  const [fish, setFishState] = React.useState<FishState>(DEFAULT_FISH);
  const [water, setWaterState] = React.useState<WaterState>(DEFAULT_WATER);
  const [loading, setLoading] = React.useState(true);
  const [lastError, setLastError] = React.useState<string | null>(null);
  const { user, isGuestMode } = useAuth();
  const tankRef = React.useRef(tank);
  tankRef.current = tank;

  const applyRemote = useCallback(async (userId: string) => {
    const [tankData, fishData, waterData] = await Promise.all([
      tankService.getTank(userId),
      fishService.getFish(userId),
      waterService.getLatestWaterReading(userId),
    ]);

    if (tankData) {
      setTankState({
        size: tankData.size,
        heater: tankData.heater,
        filter: tankData.filter,
      });
    }

    if (fishData) {
      setFishState({
        name: fishData.name,
        color: cssColor(fishData.color),
        appetite: fishData.appetite,
        activity: fishData.activity,
        finCondition: fishData.fin_condition,
        colorCondition: fishData.color_condition,
        gillCondition: fishData.gill_condition,
        bodyCondition: fishData.body_condition,
        behavior: fishData.behavior,
      });
    }

    if (waterData) {
      setWaterState({
        temperature: waterData.temperature,
        pH: waterData.ph,
        ammonia: waterData.ammonia,
        nitrite: waterData.nitrite,
        nitrate: waterData.nitrate,
      });
    }
  }, []);

  const applyGuest = useCallback(() => {
    initializeSampleData();

    const tanks = localTankOperations.getAll();
    const allFish = localFishOperations.getAll();
    const allWaterReadings = localWaterOperations.getAll();

    if (tanks.length === 0) return;

    const firstTank = tanks[0];
    setTankState({
      size: firstTank.size_gallons,
      heater: Boolean(firstTank.heater_wattage),
      filter: Boolean(firstTank.filter_type),
    });

    const storedFish = readGuestFishProfile();
    if (storedFish) {
      setFishState(storedFish);
    } else {
      const tankFish = allFish.filter((entry) => entry.tank_id === firstTank.id);
      if (tankFish.length > 0) {
        setFishState({
          ...DEFAULT_FISH,
          name: tankFish[0].name,
          color: cssColor(tankFish[0].color),
        });
      }
    }

    const tankWaterReadings = allWaterReadings.filter((entry) => entry.tank_id === firstTank.id);
    if (tankWaterReadings.length > 0) {
      const latestReading = tankWaterReadings.sort(
        (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
      )[0];
      setWaterState({
        temperature: latestReading.temperature_f,
        pH: latestReading.ph,
        ammonia: latestReading.ammonia_ppm,
        nitrite: latestReading.nitrite_ppm,
        nitrate: latestReading.nitrate_ppm,
      });
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        if (user) {
          await applyRemote(user.id);
        } else if (isGuestMode) {
          applyGuest();
        }
        if (!cancelled) setLastError(null);
      } catch (error) {
        if (!cancelled) setLastError(errorMessage(error));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadData();
    return () => {
      cancelled = true;
    };
  }, [user, isGuestMode, applyRemote, applyGuest]);

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let timer = 0;

    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        applyRemote(user.id).catch(() => {});
      }, 200);
    };

    const channel = supabase
      .channel(`habitat-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tanks', filter: `user_id=eq.${user.id}` }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fish', filter: `user_id=eq.${user.id}` }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'water_readings', filter: `user_id=eq.${user.id}` }, refresh)
      .subscribe();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [user, applyRemote]);

  const saveTank = useCallback(async (tankData: TankState) => {
    try {
      if (user) {
        await tankService.saveTank(user.id, tankData);
      } else if (isGuestMode) {
        const tanks = localTankOperations.getAll();
        if (tanks.length > 0) {
          localTankOperations.update(tanks[0].id, {
            size_gallons: tankData.size,
            heater_wattage: tankData.heater ? 25 : null,
            filter_type: tankData.filter ? 'sponge' : null,
          });
        } else {
          localTankOperations.create({
            name: 'My Tank',
            size_gallons: tankData.size,
            heater_wattage: tankData.heater ? 25 : null,
            filter_type: tankData.filter ? 'sponge' : null,
            setup_date: new Date().toISOString().split('T')[0],
            user_id: 'guest-user',
          });
        }
      }
      setTankState(tankData);
      setLastError(null);
      return true;
    } catch (error) {
      setLastError(errorMessage(error));
      return false;
    }
  }, [user, isGuestMode]);

  const saveFish = useCallback(async (fishData: FishState) => {
    try {
      if (user) {
        await fishService.saveFish(user.id, fishData, tankRef.current);
      } else if (isGuestMode) {
        writeGuestFishProfile(fishData);
        const allFish = localFishOperations.getAll();
        const tanks = localTankOperations.getAll();
        if (tanks.length > 0) {
          const tankFish = allFish.filter((entry) => entry.tank_id === tanks[0].id);
          if (tankFish.length > 0) {
            localFishOperations.update(tankFish[0].id, {
              name: fishData.name,
              color: fishData.color,
              health_status: 'healthy',
            });
          } else {
            localFishOperations.create({
              name: fishData.name,
              tank_id: tanks[0].id,
              species: 'betta_splendens',
              color: fishData.color,
              gender: 'unknown',
              acquired_date: new Date().toISOString().split('T')[0],
              health_status: 'healthy',
              user_id: 'guest-user',
            });
          }
        }
      }
      setFishState(fishData);
      setLastError(null);
      return true;
    } catch (error) {
      setLastError(errorMessage(error));
      return false;
    }
  }, [user, isGuestMode]);

  const saveWater = useCallback(async (waterData: WaterState) => {
    try {
      if (user) {
        await waterService.saveWaterReading(user.id, waterData, tankRef.current);
      } else if (isGuestMode) {
        const tanks = localTankOperations.getAll();
        if (tanks.length > 0) {
          localWaterOperations.create({
            tank_id: tanks[0].id,
            temperature_f: waterData.temperature,
            ph: waterData.pH,
            ammonia_ppm: waterData.ammonia,
            nitrite_ppm: waterData.nitrite,
            nitrate_ppm: waterData.nitrate,
            recorded_at: new Date().toISOString(),
            user_id: 'guest-user',
          });
        }
      }
      setWaterState(waterData);
      setLastError(null);
      return true;
    } catch (error) {
      setLastError(errorMessage(error));
      return false;
    }
  }, [user, isGuestMode]);

  const clearLastError = useCallback(() => setLastError(null), []);

  const value = useMemo<DataContextType>(() => ({
    tank,
    setTank: saveTank,
    fish,
    setFish: saveFish,
    water,
    setWater: saveWater,
    loading,
    isGuestMode,
    lastError,
    clearLastError,
  }), [tank, saveTank, fish, saveFish, water, saveWater, loading, isGuestMode, lastError, clearLastError]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
