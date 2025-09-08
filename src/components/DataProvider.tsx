import React, { createContext, useContext } from 'react';
import { TankState, FishState, WaterState } from '../types';
import { tankService, fishService, waterService } from '../lib/database';
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

      console.log('Loading data for user:', user.id);
      setLoading(true);

      try {
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
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Save tank data to database
  const saveTank = async (tankData: TankState) => {
    if (!user) return;
    
    try {
      console.log('Saving tank data:', tankData);
      const savedData = await tankService.saveTank(user.id, tankData);
      console.log('Tank data saved:', savedData);
      setTank(tankData);
    } catch (error) {
      console.error('Error saving tank data:', error);
    }
  };

  // Save fish data to database
  const saveFish = async (fishData: FishState) => {
    if (!user) return;
    
    try {
      console.log('Saving fish data:', fishData);
      const savedData = await fishService.saveFish(user.id, fishData);
      console.log('Fish data saved:', savedData);
      setFish(fishData);
    } catch (error) {
      console.error('Error saving fish data:', error);
    }
  };

  // Save water data to database
  const saveWater = async (waterData: WaterState) => {
    if (!user) return;
    
    try {
      console.log('Saving water data:', waterData);
      const savedData = await waterService.saveWaterReading(user.id, waterData);
      console.log('Water data saved:', savedData);
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
