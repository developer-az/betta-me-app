export interface TankState {
  size: number;
  heater: boolean;
  filter: boolean;
}

export interface FishState {
  name: string;
  color: string;
  appetite: string;
  activity: string;
  finCondition: string;
  colorCondition: string;
  gillCondition: string;
  bodyCondition: string;
  behavior: string;
}

export interface WaterState {
  temperature: number; // Fahrenheit
  pH: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
}



