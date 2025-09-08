// Health alert and notification system for Betta Me app

import { FishState, WaterState } from '../types';

export interface HealthAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'water' | 'fish' | 'equipment';
  title: string;
  message: string;
  recommendation: string;
  timestamp: Date;
  dismissed?: boolean;
}

export const analyzeWaterHealth = (water: WaterState): HealthAlert[] => {
  const alerts: HealthAlert[] = [];
  
  // Critical temperature alerts
  if (water.temperature < 70 || water.temperature > 85) {
    alerts.push({
      id: `temp-critical-${Date.now()}`,
      type: 'critical',
      category: 'water',
      title: 'Temperature Emergency',
      message: `Water temperature is ${water.temperature}°F - this is dangerous for your betta!`,
      recommendation: water.temperature < 70 
        ? 'Immediately check your heater and consider emergency heating measures.'
        : 'Turn off heater immediately and increase water circulation.',
      timestamp: new Date()
    });
  } else if (water.temperature < 75 || water.temperature > 82) {
    alerts.push({
      id: `temp-warning-${Date.now()}`,
      type: 'warning',
      category: 'water',
      title: 'Temperature Suboptimal',
      message: `Water temperature is ${water.temperature}°F - outside ideal range.`,
      recommendation: 'Adjust heater settings to maintain 75-82°F.',
      timestamp: new Date()
    });
  }

  // Critical chemical alerts
  if (water.ammonia > 0) {
    alerts.push({
      id: `ammonia-critical-${Date.now()}`,
      type: 'critical',
      category: 'water',
      title: 'Ammonia Poisoning Risk',
      message: `Ammonia level is ${water.ammonia} ppm - toxic to your betta!`,
      recommendation: 'Perform immediate 25-50% water change. Check filter and feeding schedule.',
      timestamp: new Date()
    });
  }

  if (water.nitrite > 0) {
    alerts.push({
      id: `nitrite-critical-${Date.now()}`,
      type: 'critical',
      category: 'water',
      title: 'Nitrite Poisoning Risk',
      message: `Nitrite level is ${water.nitrite} ppm - toxic to your betta!`,
      recommendation: 'Perform immediate water change. Your tank may not be fully cycled.',
      timestamp: new Date()
    });
  }

  if (water.nitrate > 40) {
    alerts.push({
      id: `nitrate-critical-${Date.now()}`,
      type: 'critical',
      category: 'water',
      title: 'High Nitrate Levels',
      message: `Nitrate level is ${water.nitrate} ppm - very unhealthy!`,
      recommendation: 'Perform large water change (50%) and increase weekly water change frequency.',
      timestamp: new Date()
    });
  } else if (water.nitrate > 20) {
    alerts.push({
      id: `nitrate-warning-${Date.now()}`,
      type: 'warning',
      category: 'water',
      title: 'Elevated Nitrates',
      message: `Nitrate level is ${water.nitrate} ppm - consider water change.`,
      recommendation: 'Perform 25% water change and maintain weekly water changes.',
      timestamp: new Date()
    });
  }

  // pH alerts
  if (water.pH < 6.0 || water.pH > 8.0) {
    alerts.push({
      id: `ph-critical-${Date.now()}`,
      type: 'critical',
      category: 'water',
      title: 'Extreme pH Levels',
      message: `pH is ${water.pH} - dangerously outside safe range!`,
      recommendation: 'Gradually adjust pH using appropriate conditioners. Monitor closely.',
      timestamp: new Date()
    });
  } else if (water.pH < 6.5 || water.pH > 7.5) {
    alerts.push({
      id: `ph-warning-${Date.now()}`,
      type: 'warning',
      category: 'water',
      title: 'pH Suboptimal',
      message: `pH is ${water.pH} - outside ideal range for bettas.`,
      recommendation: 'Consider gradual pH adjustment to 6.5-7.5 range.',
      timestamp: new Date()
    });
  }

  return alerts;
};

export const analyzeFishHealth = (fish: FishState): HealthAlert[] => {
  const alerts: HealthAlert[] = [];
  
  // Critical fish health issues
  if (fish.appetite === 'Not eating at all') {
    alerts.push({
      id: `appetite-critical-${Date.now()}`,
      type: 'critical',
      category: 'fish',
      title: 'Fish Not Eating',
      message: 'Your betta has completely stopped eating - this is a serious concern!',
      recommendation: 'Check water parameters immediately. Consider consulting a vet if this continues.',
      timestamp: new Date()
    });
  }

  if (fish.activity === 'Lethargic' || fish.activity === 'Lying at bottom') {
    alerts.push({
      id: `activity-critical-${Date.now()}`,
      type: 'critical',
      category: 'fish',
      title: 'Concerning Activity Level',
      message: 'Your betta is showing signs of lethargy or illness.',
      recommendation: 'Monitor closely and check all water parameters. Consider veterinary consultation.',
      timestamp: new Date()
    });
  }

  if (fish.finCondition === 'Damaged' || fish.finCondition === 'Rotting') {
    alerts.push({
      id: `fins-critical-${Date.now()}`,
      type: 'critical',
      category: 'fish',
      title: 'Fin Damage Detected',
      message: 'Your betta has damaged or rotting fins - sign of poor water quality or disease.',
      recommendation: 'Improve water quality immediately. Consider aquarium salt treatment.',
      timestamp: new Date()
    });
  }

  if (fish.gillCondition === 'Rapid breathing' || fish.gillCondition === 'Gasping') {
    alerts.push({
      id: `gills-critical-${Date.now()}`,
      type: 'critical',
      category: 'fish',
      title: 'Breathing Difficulties',
      message: 'Your betta is showing signs of respiratory distress.',
      recommendation: 'Check water temperature and oxygen levels. Increase surface agitation.',
      timestamp: new Date()
    });
  }

  // Warning level issues
  if (fish.appetite === 'Eating less') {
    alerts.push({
      id: `appetite-warning-${Date.now()}`,
      type: 'warning',
      category: 'fish',
      title: 'Reduced Appetite',
      message: 'Your betta is eating less than usual.',
      recommendation: 'Monitor feeding and check water quality.',
      timestamp: new Date()
    });
  }

  if (fish.colorCondition === 'Fading' || fish.colorCondition === 'Spots/patches') {
    alerts.push({
      id: `color-warning-${Date.now()}`,
      type: 'warning',
      category: 'fish',
      title: 'Color Changes',
      message: 'Your betta\'s color is changing - possible stress or health issue.',
      recommendation: 'Review tank conditions and monitor for other symptoms.',
      timestamp: new Date()
    });
  }

  return alerts;
};

export const getHealthScore = (fish: FishState, water: WaterState): number => {
  let score = 100;

  // Water quality impact
  if (water.temperature < 75 || water.temperature > 82) score -= 10;
  if (water.temperature < 70 || water.temperature > 85) score -= 30;
  
  if (water.pH < 6.5 || water.pH > 7.5) score -= 5;
  if (water.pH < 6.0 || water.pH > 8.0) score -= 20;
  
  if (water.ammonia > 0) score -= 40;
  if (water.nitrite > 0) score -= 35;
  if (water.nitrate > 20) score -= 10;
  if (water.nitrate > 40) score -= 25;

  // Fish health impact
  if (fish.appetite === 'Eating less') score -= 10;
  if (fish.appetite === 'Not eating at all') score -= 30;
  
  if (fish.activity === 'Less active') score -= 10;
  if (fish.activity === 'Lethargic' || fish.activity === 'Lying at bottom') score -= 25;
  
  if (fish.finCondition === 'Minor damage') score -= 5;
  if (fish.finCondition === 'Damaged' || fish.finCondition === 'Rotting') score -= 20;
  
  if (fish.colorCondition === 'Fading') score -= 5;
  if (fish.colorCondition === 'Spots/patches') score -= 15;
  
  if (fish.gillCondition === 'Rapid breathing') score -= 15;
  if (fish.gillCondition === 'Gasping') score -= 25;
  
  if (fish.bodyCondition === 'Thin') score -= 10;
  if (fish.bodyCondition === 'Bloated' || fish.bodyCondition === 'Injured') score -= 20;

  return Math.max(0, score);
};

export const getHealthScoreDescription = (score: number): { level: string; color: string; description: string } => {
  if (score >= 90) {
    return {
      level: 'Excellent',
      color: 'text-green-600',
      description: 'Your betta is in excellent health!'
    };
  } else if (score >= 75) {
    return {
      level: 'Good',
      color: 'text-blue-600',
      description: 'Your betta is healthy with minor areas for improvement.'
    };
  } else if (score >= 60) {
    return {
      level: 'Fair',
      color: 'text-yellow-600',
      description: 'Your betta needs some attention to improve health.'
    };
  } else if (score >= 40) {
    return {
      level: 'Poor',
      color: 'text-orange-600',
      description: 'Your betta has health concerns that need immediate attention.'
    };
  } else {
    return {
      level: 'Critical',
      color: 'text-red-600',
      description: 'Your betta is in critical condition - seek help immediately!'
    };
  }
};