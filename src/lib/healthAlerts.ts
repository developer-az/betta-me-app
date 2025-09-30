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

// Generate unique IDs for alerts
let alertIdCounter = 0;
const generateAlertId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${alertIdCounter++}`;
};

export const analyzeWaterHealth = (water: WaterState): HealthAlert[] => {
  const alerts: HealthAlert[] = [];
  
  // Critical temperature alerts
  if (water.temperature < 70 || water.temperature > 85) {
    alerts.push({
      id: generateAlertId('temp-critical'),
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
      id: generateAlertId('temp-warning'),
      type: 'warning',
      category: 'water',
      title: 'Temperature Suboptimal',
      message: `Water temperature is ${water.temperature}°F - outside ideal range.`,
      recommendation: 'Adjust heater settings to maintain 75-82°F.',
      timestamp: new Date()
    });
  } else if (water.temperature < 76 || water.temperature > 80) {
    // Even slight deviation from perfect range
    alerts.push({
      id: generateAlertId('temp-info'),
      type: 'info',
      category: 'water',
      title: 'Temperature Slightly Suboptimal',
      message: `Water temperature is ${water.temperature}°F - bettas prefer 76-80°F for peak health.`,
      recommendation: 'Consider fine-tuning heater for optimal comfort.',
      timestamp: new Date()
    });
  }

  // Critical chemical alerts
  if (water.ammonia > 0) {
    alerts.push({
      id: generateAlertId('ammonia-critical'),
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
      id: generateAlertId('nitrite-critical'),
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
      id: generateAlertId('nitrate-critical'),
      type: 'critical',
      category: 'water',
      title: 'High Nitrate Levels',
      message: `Nitrate level is ${water.nitrate} ppm - very unhealthy!`,
      recommendation: 'Perform large water change (50%) and increase weekly water change frequency.',
      timestamp: new Date()
    });
  } else if (water.nitrate > 20) {
    alerts.push({
      id: generateAlertId('nitrate-warning'),
      type: 'warning',
      category: 'water',
      title: 'Elevated Nitrates',
      message: `Nitrate level is ${water.nitrate} ppm - consider water change.`,
      recommendation: 'Perform 25% water change and maintain weekly water changes.',
      timestamp: new Date()
    });
  } else if (water.nitrate > 10) {
    // Even slight elevation from ideal
    alerts.push({
      id: generateAlertId('nitrate-info'),
      type: 'info',
      category: 'water',
      title: 'Nitrate Building Up',
      message: `Nitrate level is ${water.nitrate} ppm - bettas thrive best under 10 ppm.`,
      recommendation: 'Schedule your weekly water change soon to maintain pristine conditions.',
      timestamp: new Date()
    });
  }

  // pH alerts
  if (water.pH < 6.0 || water.pH > 8.0) {
    alerts.push({
      id: generateAlertId('ph-critical'),
      type: 'critical',
      category: 'water',
      title: 'Extreme pH Levels',
      message: `pH is ${water.pH} - dangerously outside safe range!`,
      recommendation: 'Gradually adjust pH using appropriate conditioners. Monitor closely.',
      timestamp: new Date()
    });
  } else if (water.pH < 6.5 || water.pH > 7.5) {
    alerts.push({
      id: generateAlertId('ph-warning'),
      type: 'warning',
      category: 'water',
      title: 'pH Suboptimal',
      message: `pH is ${water.pH} - outside ideal range for bettas.`,
      recommendation: 'Consider gradual pH adjustment to 6.5-7.5 range.',
      timestamp: new Date()
    });
  } else if (water.pH < 6.8 || water.pH > 7.2) {
    // Even slight deviation from perfect neutral range
    alerts.push({
      id: generateAlertId('ph-info'),
      type: 'info',
      category: 'water',
      title: 'pH Could Be Better',
      message: `pH is ${water.pH} - bettas prefer neutral pH around 7.0 for optimal health.`,
      recommendation: 'Monitor pH levels and consider gradual adjustments if needed.',
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
      id: generateAlertId('appetite-critical'),
      type: 'critical',
      category: 'fish',
      title: 'Fish Not Eating',
      message: 'Your betta has completely stopped eating - this is a serious concern!',
      recommendation: 'Check water parameters immediately. Consider consulting a vet if this continues.',
      timestamp: new Date()
    });
  } else if (fish.appetite === 'Eating less') {
    alerts.push({
      id: generateAlertId('appetite-warning'),
      type: 'warning',
      category: 'fish',
      title: 'Reduced Appetite',
      message: 'Your betta is eating less than usual.',
      recommendation: 'Monitor feeding and check water quality.',
      timestamp: new Date()
    });
  } else if (fish.appetite !== 'Eating well') {
    // Any other appetite state that's not optimal
    alerts.push({
      id: generateAlertId('appetite-info'),
      type: 'info',
      category: 'fish',
      title: 'Appetite Not Optimal',
      message: `Your betta's appetite is "${fish.appetite}" - monitor for changes.`,
      recommendation: 'Keep an eye on feeding behavior and water parameters.',
      timestamp: new Date()
    });
  }

  if (fish.activity === 'Lethargic' || fish.activity === 'Lying at bottom') {
    alerts.push({
      id: generateAlertId('activity-critical'),
      type: 'critical',
      category: 'fish',
      title: 'Concerning Activity Level',
      message: 'Your betta is showing signs of lethargy or illness.',
      recommendation: 'Monitor closely and check all water parameters. Consider veterinary consultation.',
      timestamp: new Date()
    });
  } else if (fish.activity === 'Less active') {
    alerts.push({
      id: generateAlertId('activity-warning'),
      type: 'warning',
      category: 'fish',
      title: 'Reduced Activity',
      message: 'Your betta is less active than usual.',
      recommendation: 'Check temperature and water quality. Monitor for other symptoms.',
      timestamp: new Date()
    });
  } else if (fish.activity === 'Hyperactive') {
    alerts.push({
      id: generateAlertId('activity-hyperactive'),
      type: 'warning',
      category: 'fish',
      title: 'Unusual Hyperactivity',
      message: 'Your betta is more active than normal - this could indicate stress.',
      recommendation: 'Check for aggressive tankmates, water quality issues, or reflections causing stress.',
      timestamp: new Date()
    });
  } else if (fish.activity !== 'Normal') {
    alerts.push({
      id: generateAlertId('activity-info'),
      type: 'info',
      category: 'fish',
      title: 'Activity Change Noted',
      message: `Your betta's activity is "${fish.activity}" - keep monitoring.`,
      recommendation: 'Watch for patterns and ensure environment is optimal.',
      timestamp: new Date()
    });
  }

  if (fish.finCondition === 'Damaged' || fish.finCondition === 'Rotting') {
    alerts.push({
      id: generateAlertId('fins-critical'),
      type: 'critical',
      category: 'fish',
      title: 'Fin Damage Detected',
      message: 'Your betta has damaged or rotting fins - sign of poor water quality or disease.',
      recommendation: 'Improve water quality immediately. Consider aquarium salt treatment.',
      timestamp: new Date()
    });
  } else if (fish.finCondition === 'Torn' || fish.finCondition === 'Clamped') {
    alerts.push({
      id: generateAlertId('fins-warning'),
      type: 'warning',
      category: 'fish',
      title: 'Fin Issues Detected',
      message: `Your betta has ${fish.finCondition.toLowerCase()} fins - needs attention.`,
      recommendation: 'Check for sharp decorations, improve water changes, and monitor closely.',
      timestamp: new Date()
    });
  } else if (fish.finCondition === 'Fin rot') {
    alerts.push({
      id: generateAlertId('fins-rot'),
      type: 'critical',
      category: 'fish',
      title: 'Fin Rot Detected',
      message: 'Your betta has fin rot - a bacterial infection requiring immediate treatment.',
      recommendation: 'Perform 50% water change, raise temperature slightly, add aquarium salt. Consider antibiotics.',
      timestamp: new Date()
    });
  } else if (fish.finCondition !== 'Healthy') {
    alerts.push({
      id: generateAlertId('fins-info'),
      type: 'info',
      category: 'fish',
      title: 'Monitor Fin Health',
      message: `Fin condition is "${fish.finCondition}" - watch for changes.`,
      recommendation: 'Ensure clean water and no sharp tank decorations.',
      timestamp: new Date()
    });
  }

  if (fish.gillCondition === 'Rapid breathing' || fish.gillCondition === 'Gasping') {
    alerts.push({
      id: generateAlertId('gills-critical'),
      type: 'critical',
      category: 'fish',
      title: 'Breathing Difficulties',
      message: 'Your betta is showing signs of respiratory distress.',
      recommendation: 'Check water temperature and oxygen levels. Increase surface agitation.',
      timestamp: new Date()
    });
  } else if (fish.gillCondition !== 'Normal') {
    alerts.push({
      id: generateAlertId('gills-warning'),
      type: 'warning',
      category: 'fish',
      title: 'Gill Condition Change',
      message: `Gill condition is "${fish.gillCondition}" - monitor breathing.`,
      recommendation: 'Check water parameters and ensure adequate oxygenation.',
      timestamp: new Date()
    });
  }

  // Color condition alerts
  if (fish.colorCondition === 'Fading' || fish.colorCondition === 'Spots/patches') {
    alerts.push({
      id: generateAlertId('color-warning'),
      type: 'warning',
      category: 'fish',
      title: 'Color Changes',
      message: 'Your betta\'s color is changing - possible stress or health issue.',
      recommendation: 'Review tank conditions and monitor for other symptoms.',
      timestamp: new Date()
    });
  } else if (fish.colorCondition === 'Spots') {
    alerts.push({
      id: generateAlertId('color-spots'),
      type: 'critical',
      category: 'fish',
      title: 'White Spots Detected',
      message: 'Your betta has spots - possible ich (white spot disease).',
      recommendation: 'Raise temperature to 80°F gradually. Consider ich medication.',
      timestamp: new Date()
    });
  } else if (fish.colorCondition !== 'Vibrant') {
    alerts.push({
      id: generateAlertId('color-info'),
      type: 'info',
      category: 'fish',
      title: 'Color Not Optimal',
      message: `Color condition is "${fish.colorCondition}" - bettas show stress through color.`,
      recommendation: 'Ensure optimal water parameters and reduce stressors.',
      timestamp: new Date()
    });
  }

  // Body condition alerts
  if (fish.bodyCondition === 'Bloated') {
    alerts.push({
      id: generateAlertId('body-bloated'),
      type: 'warning',
      category: 'fish',
      title: 'Bloating Detected',
      message: 'Your betta appears bloated - possible overfeeding or constipation.',
      recommendation: 'Fast for 24-48 hours, then feed daphnia or peas. Reduce feeding portions.',
      timestamp: new Date()
    });
  } else if (fish.bodyCondition === 'Thin') {
    alerts.push({
      id: generateAlertId('body-thin'),
      type: 'warning',
      category: 'fish',
      title: 'Weight Loss Detected',
      message: 'Your betta appears thin - possible underfeeding or parasites.',
      recommendation: 'Increase feeding frequency. Check for internal parasites if this persists.',
      timestamp: new Date()
    });
  } else if (fish.bodyCondition === 'Injured') {
    alerts.push({
      id: generateAlertId('body-injured'),
      type: 'critical',
      category: 'fish',
      title: 'Injury Detected',
      message: 'Your betta has visible injuries.',
      recommendation: 'Remove sharp decorations. Keep water pristine. Monitor for infection.',
      timestamp: new Date()
    });
  } else if (fish.bodyCondition !== 'Normal') {
    alerts.push({
      id: generateAlertId('body-info'),
      type: 'info',
      category: 'fish',
      title: 'Body Condition Change',
      message: `Body condition is "${fish.bodyCondition}" - keep monitoring.`,
      recommendation: 'Assess feeding schedule and check for diseases.',
      timestamp: new Date()
    });
  }

  // Behavior alerts
  if (fish.behavior !== 'Normal') {
    if (fish.behavior === 'Glass surfing' || fish.behavior === 'Darting around') {
      alerts.push({
        id: generateAlertId('behavior-stress'),
        type: 'warning',
        category: 'fish',
        title: 'Stress Behavior Detected',
        message: `Your betta is ${fish.behavior.toLowerCase()} - sign of stress or new tank syndrome.`,
        recommendation: 'Check water parameters. Reduce light. Add hiding spots. Remove reflections.',
        timestamp: new Date()
      });
    } else {
      alerts.push({
        id: generateAlertId('behavior-info'),
        type: 'info',
        category: 'fish',
        title: 'Unusual Behavior',
        message: `Your betta is showing "${fish.behavior}" behavior.`,
        recommendation: 'Monitor for patterns and ensure optimal tank conditions.',
        timestamp: new Date()
      });
    }
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