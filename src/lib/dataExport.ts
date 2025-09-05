// Data export and backup utilities for Betta Me app

import { tankService, fishService, waterService } from './database';
import { TankState, FishState, WaterState } from '../types';

export interface BettaDataExport {
  version: string;
  exportDate: string;
  userId: string;
  data: {
    tank: TankState | null;
    fish: FishState | null;
    water: WaterState | null;
    tankHistory: any[];
    fishHistory: any[];
    waterHistory: any[];
  };
}

export const exportUserData = async (userId: string): Promise<BettaDataExport> => {
  try {
    // Get current data
    const [tank, fish, water] = await Promise.all([
      tankService.getTank(userId).catch(() => null),
      fishService.getFish(userId).catch(() => null),
      waterService.getLatestWaterReading(userId).catch(() => null)
    ]);

    // Get historical data (last 50 entries to keep file manageable)
    const [tankHistory, fishHistory, waterHistory] = await Promise.all([
      tankService.getTankHistory(userId, 50).catch(() => []),
      fishService.getFishHistory(userId, 50).catch(() => []),
      waterService.getWaterHistory(userId, 50).catch(() => [])
    ]);

    const exportData: BettaDataExport = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      userId,
      data: {
        tank: tank ? {
          size: tank.size,
          heater: tank.heater,
          filter: tank.filter
        } : null,
        fish: fish ? {
          name: fish.name,
          color: fish.color,
          appetite: fish.appetite,
          activity: fish.activity,
          finCondition: fish.fin_condition,
          colorCondition: fish.color_condition,
          gillCondition: fish.gill_condition,
          bodyCondition: fish.body_condition,
          behavior: fish.behavior
        } : null,
        water: water ? {
          temperature: water.temperature,
          pH: water.ph,
          ammonia: water.ammonia,
          nitrite: water.nitrite,
          nitrate: water.nitrate
        } : null,
        tankHistory,
        fishHistory,
        waterHistory
      }
    };

    return exportData;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw new Error('Failed to export data. Please try again.');
  }
};

export const downloadDataAsJSON = (data: BettaDataExport, filename?: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `betta-data-export-${new Date().toISOString().split('T')[0]}.json`;
  
  // Temporarily add to DOM to trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

export const downloadDataAsCSV = async (userId: string) => {
  try {
    const waterHistory = await waterService.getWaterHistory(userId, 100);
    
    if (waterHistory.length === 0) {
      throw new Error('No water data available for export');
    }

    // Create CSV content
    const headers = ['Date', 'Temperature (°F)', 'pH', 'Ammonia (ppm)', 'Nitrite (ppm)', 'Nitrate (ppm)'];
    const csvContent = [
      headers.join(','),
      ...waterHistory.map(reading => [
        new Date(reading.created_at).toLocaleDateString(),
        reading.temperature,
        reading.ph,
        reading.ammonia,
        reading.nitrite,
        reading.nitrate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `betta-water-readings-${new Date().toISOString().split('T')[0]}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw new Error('Failed to export CSV data. Please try again.');
  }
};

export const generateDataSummary = (data: BettaDataExport): string => {
  const { data: bettaData } = data;
  
  let summary = `🐠 Betta Data Summary (Exported: ${new Date(data.exportDate).toLocaleDateString()})\n\n`;
  
  if (bettaData.fish) {
    summary += `Fish Information:\n`;
    summary += `• Name: ${bettaData.fish.name}\n`;
    summary += `• Color: ${bettaData.fish.color}\n`;
    summary += `• Appetite: ${bettaData.fish.appetite}\n`;
    summary += `• Activity: ${bettaData.fish.activity}\n`;
    summary += `• Overall Health: ${bettaData.fish.finCondition === 'Healthy' && bettaData.fish.colorCondition === 'Vibrant' ? 'Good' : 'Needs Attention'}\n\n`;
  }
  
  if (bettaData.tank) {
    summary += `Tank Setup:\n`;
    summary += `• Size: ${bettaData.tank.size} gallons\n`;
    summary += `• Heater: ${bettaData.tank.heater ? 'Yes' : 'No'}\n`;
    summary += `• Filter: ${bettaData.tank.filter ? 'Yes' : 'No'}\n\n`;
  }
  
  if (bettaData.water) {
    summary += `Current Water Parameters:\n`;
    summary += `• Temperature: ${bettaData.water.temperature}°F\n`;
    summary += `• pH: ${bettaData.water.pH}\n`;
    summary += `• Ammonia: ${bettaData.water.ammonia} ppm\n`;
    summary += `• Nitrite: ${bettaData.water.nitrite} ppm\n`;
    summary += `• Nitrate: ${bettaData.water.nitrate} ppm\n\n`;
  }
  
  summary += `Historical Data:\n`;
  summary += `• Tank updates: ${bettaData.tankHistory.length} records\n`;
  summary += `• Fish health records: ${bettaData.fishHistory.length} records\n`;
  summary += `• Water test results: ${bettaData.waterHistory.length} records\n`;
  
  return summary;
};