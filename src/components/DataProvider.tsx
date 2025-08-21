import React, { createContext, useContext } from 'react';
import { TankState, FishState, WaterState } from '../types';
import { tankService, fishService, waterService, getOrCreateTankId } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';

interface DataContextType {
  tank: TankState;
  setTank: (tank: TankState) => Promise<void>;
  fish: FishState;
  setFish: (fish: FishState) => Promise<void>;
  water: WaterState;
  setWater: (water: WaterState) => Promise<void>;
  loading: boolean;
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
  const { user } = useAuth();

  // Load data from database when user is authenticated
  React.useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Load tank data
        const tankData = await tankService.getTank(user.id);
        if (tankData) {
          setTank({
            size: tankData.size,
            heater: tankData.heater,
            filter: tankData.filter,
          });
        }

        // Load fish data
        const fishData = await fishService.getFish(user.id);
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
        if (waterData) {
          setWater({
            temperature: waterData.temperature,
            pH: waterData.ph,
            ammonia: waterData.ammonia,
            nitrite: waterData.nitrite,
            nitrate: waterData.nitrate,
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Save tank data to database
  const saveTank = async (tankData: TankState) => {
    if (!user) return;
    
    try {
      await tankService.saveTank(user.id, tankData);
      setTank(tankData);
    } catch (error) {
      console.error('Error saving tank data:', error);
    }
  };

  // Save fish data to database
  const saveFish = async (fishData: FishState) => {
    if (!user) return;
    
    try {
      const tankId = await getOrCreateTankId(user.id, tank);
      await fishService.saveFish(user.id, tankId, fishData);
      setFish(fishData);
    } catch (error) {
      console.error('Error saving fish data:', error);
    }
  };

  // Save water data to database
  const saveWater = async (waterData: WaterState) => {
    if (!user) return;
    
    try {
      const tankId = await getOrCreateTankId(user.id, tank);
      await waterService.saveWaterReading(user.id, tankId, waterData);
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
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
