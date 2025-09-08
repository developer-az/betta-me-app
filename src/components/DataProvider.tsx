import React, { createContext, useContext } from 'react';
import { TankState, FishState, WaterState } from '../types';
import { tankService, fishService, waterService } from '../lib/database';
import { localTankOperations, localFishOperations, localWaterOperations, initializeSampleData } from '../lib/localData';
import { useAuth } from '../contexts/AuthContext';

interface DataContextType {
  tank: TankState;
  setTank: (tank: TankState) => Promise<void>;
  fish: FishState;
  setFish: (fish: FishState) => Promise<void>;
  water: WaterState;
  setWater: (water: WaterState) => Promise<void>;
  loading: boolean;
  isGuestMode: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [tank, setTank] = React.useState<TankState>({ size: 10, heater: true, filter: true });
  const [fish, setFish] = React.useState<FishState>({ name: '', color: '#e57373', appetite: 'Eating well', activity: 'Normal', finCondition: 'Healthy', colorCondition: 'Vibrant', gillCondition: 'Normal', bodyCondition: 'Normal', behavior: 'Normal' });
  const [water, setWater] = React.useState<WaterState>({ temperature: 78, pH: 7, ammonia: 0, nitrite: 0, nitrate: 10 });
  const [loading, setLoading] = React.useState(true);
  const { user, isGuestMode } = useAuth();

  // Load data from database or localStorage
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        if (user) {
          // Authenticated user - load from Supabase
          console.log('Loading data for user:', user.id);
          
          // Load tank data
          const tankData = await tankService.getTank(user.id);
          console.log('Tank data loaded:', tankData);
          if (tankData) {
            setTank({
              size: tankData.size,
              heater: tankData.heater,
              filter: tankData.filter,
            });
          }

          // Load fish data
          const fishData = await fishService.getFish(user.id);
          console.log('Fish data loaded:', fishData);
          if (fishData) {
            setFish({
              name: fishData.name,
              color: fishData.color,
              appetite: fishData.appetite,
              activity: fishData.activity,
              finCondition: fishData.fin_condition,
              colorCondition: fishData.color_condition,
              gillCondition: fishData.gill_condition,
              bodyCondition: fishData.body_condition,
              behavior: fishData.behavior,
            });
          }

          // Load latest water reading
          const waterData = await waterService.getLatestWaterReading(user.id);
          console.log('Water data loaded:', waterData);
          if (waterData) {
            setWater({
              temperature: waterData.temperature,
              pH: waterData.ph,
              ammonia: waterData.ammonia,
              nitrite: waterData.nitrite,
              nitrate: waterData.nitrate,
            });
          }
        } else if (isGuestMode) {
          // Guest mode - load from localStorage
          console.log('Loading guest mode data from localStorage');
          
          // Initialize sample data if none exists
          initializeSampleData();
          
          const tanks = localTankOperations.getAll();
          const allFish = localFishOperations.getAll();
          const allWaterReadings = localWaterOperations.getAll();
          
          if (tanks.length > 0) {
            const firstTank = tanks[0];
            setTank({
              size: firstTank.size_gallons,
              heater: firstTank.heater_wattage ? true : false,
              filter: firstTank.filter_type ? true : false,
            });
            
            // Load fish for this tank
            const tankFish = allFish.filter(f => f.tank_id === firstTank.id);
            if (tankFish.length > 0) {
              const firstFish = tankFish[0];
              setFish({
                name: firstFish.name,
                color: firstFish.color || '#e57373',
                appetite: 'Eating well',
                activity: 'Normal',
                finCondition: 'Healthy',
                colorCondition: 'Vibrant',
                gillCondition: 'Normal',
                bodyCondition: 'Normal',
                behavior: 'Normal',
              });
            }
            
            // Load latest water reading for this tank
            const tankWaterReadings = allWaterReadings.filter(w => w.tank_id === firstTank.id);
            if (tankWaterReadings.length > 0) {
              const latestReading = tankWaterReadings.sort(
                (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
              )[0];
              
              setWater({
                temperature: latestReading.temperature_f,
                pH: latestReading.ph,
                ammonia: latestReading.ammonia_ppm,
                nitrite: latestReading.nitrite_ppm,
                nitrate: latestReading.nitrate_ppm,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isGuestMode]);

  // Save tank data
  const saveTank = async (tankData: TankState) => {
    try {
      if (user) {
        // Authenticated user - save to Supabase
        console.log('Saving tank data:', tankData);
        const savedData = await tankService.saveTank(user.id, tankData);
        console.log('Tank data saved:', savedData);
      } else if (isGuestMode) {
        // Guest mode - save to localStorage
        console.log('Saving tank data to localStorage:', tankData);
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
      setTank(tankData);
    } catch (error) {
      console.error('Error saving tank data:', error);
    }
  };

  // Save fish data
  const saveFish = async (fishData: FishState) => {
    try {
      if (user) {
        // Authenticated user - save to Supabase
        console.log('Saving fish data:', fishData);
        const savedData = await fishService.saveFish(user.id, fishData);
        console.log('Fish data saved:', savedData);
      } else if (isGuestMode) {
        // Guest mode - save to localStorage
        console.log('Saving fish data to localStorage:', fishData);
        const allFish = localFishOperations.getAll();
        const tanks = localTankOperations.getAll();
        
        if (tanks.length > 0) {
          const tankFish = allFish.filter(f => f.tank_id === tanks[0].id);
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
      setFish(fishData);
    } catch (error) {
      console.error('Error saving fish data:', error);
    }
  };

  // Save water data
  const saveWater = async (waterData: WaterState) => {
    try {
      if (user) {
        // Authenticated user - save to Supabase
        console.log('Saving water data:', waterData);
        const savedData = await waterService.saveWaterReading(user.id, waterData);
        console.log('Water data saved:', savedData);
      } else if (isGuestMode) {
        // Guest mode - save to localStorage
        console.log('Saving water data to localStorage:', waterData);
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
      setWater(waterData);
    } catch (error) {
      console.error('Error saving water data:', error);
    }
  };

  const value: DataContextType = {
    tank,
    setTank: saveTank,
    fish,
    setFish: saveFish,
    water,
    setWater: saveWater,
    loading,
    isGuestMode,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
