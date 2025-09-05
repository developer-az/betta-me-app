// Feeding schedule and care reminders for Betta Me app

export interface FeedingSchedule {
  id: string;
  time: string; // HH:MM format
  amount: string;
  foodType: string;
  enabled: boolean;
  days: string[]; // ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
}

export interface CareReminder {
  id: string;
  type: 'water-change' | 'water-test' | 'filter-clean' | 'heater-check' | 'feeding' | 'medication' | 'custom';
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  customDays?: number; // for custom frequency
  lastCompleted?: Date;
  nextDue: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

export const defaultFeedingSchedule: FeedingSchedule[] = [
  {
    id: 'morning-feed',
    time: '08:00',
    amount: '2-3 pellets',
    foodType: 'High-quality betta pellets',
    enabled: true,
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  },
  {
    id: 'evening-feed',
    time: '18:00',
    amount: '2-3 pellets',
    foodType: 'High-quality betta pellets',
    enabled: true,
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  }
];

export const defaultCareReminders: CareReminder[] = [
  {
    id: 'weekly-water-change',
    type: 'water-change',
    title: 'Weekly Water Change',
    description: 'Change 25% of tank water to maintain water quality',
    frequency: 'weekly',
    nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'high',
    enabled: true
  },
  {
    id: 'water-quality-test',
    type: 'water-test',
    title: 'Water Quality Test',
    description: 'Test pH, ammonia, nitrite, and nitrate levels',
    frequency: 'weekly',
    nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    enabled: true
  },
  {
    id: 'filter-maintenance',
    type: 'filter-clean',
    title: 'Filter Maintenance',
    description: 'Clean filter media and check flow rate',
    frequency: 'biweekly',
    nextDue: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    enabled: true
  },
  {
    id: 'heater-check',
    type: 'heater-check',
    title: 'Heater Check',
    description: 'Verify heater is working and temperature is stable',
    frequency: 'monthly',
    nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    enabled: true
  }
];

export const getUpcomingReminders = (reminders: CareReminder[], days: number = 7): CareReminder[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return reminders
    .filter(reminder => reminder.enabled && reminder.nextDue <= futureDate)
    .sort((a, b) => a.nextDue.getTime() - b.nextDue.getTime());
};

export const getOverdueReminders = (reminders: CareReminder[]): CareReminder[] => {
  const now = new Date();
  
  return reminders
    .filter(reminder => reminder.enabled && reminder.nextDue < now)
    .sort((a, b) => {
      // Sort by priority first, then by how overdue
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return a.nextDue.getTime() - b.nextDue.getTime();
    });
};

export const getTodaysFeedings = (schedule: FeedingSchedule[]): FeedingSchedule[] => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
  const dayMap: { [key: string]: string } = {
    'mon': 'mon', 'tue': 'tue', 'wed': 'wed', 'thu': 'thu', 
    'fri': 'fri', 'sat': 'sat', 'sun': 'sun'
  };
  
  return schedule
    .filter(feed => feed.enabled && feed.days.includes(dayMap[today] || today))
    .sort((a, b) => a.time.localeCompare(b.time));
};

export const markReminderComplete = (reminder: CareReminder): CareReminder => {
  const now = new Date();
  let nextDue = new Date(now);
  
  switch (reminder.frequency) {
    case 'daily':
      nextDue.setDate(nextDue.getDate() + 1);
      break;
    case 'weekly':
      nextDue.setDate(nextDue.getDate() + 7);
      break;
    case 'biweekly':
      nextDue.setDate(nextDue.getDate() + 14);
      break;
    case 'monthly':
      nextDue.setMonth(nextDue.getMonth() + 1);
      break;
    case 'custom':
      if (reminder.customDays) {
        nextDue.setDate(nextDue.getDate() + reminder.customDays);
      }
      break;
  }
  
  return {
    ...reminder,
    lastCompleted: now,
    nextDue: nextDue
  };
};

export const formatTimeRemaining = (date: Date): string => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff < 0) {
    const daysPast = Math.floor(Math.abs(diff) / (24 * 60 * 60 * 1000));
    const hoursPast = Math.floor(Math.abs(diff) / (60 * 60 * 1000)) % 24;
    
    if (daysPast > 0) {
      return `${daysPast} day${daysPast > 1 ? 's' : ''} overdue`;
    } else if (hoursPast > 0) {
      return `${hoursPast} hour${hoursPast > 1 ? 's' : ''} overdue`;
    } else {
      return 'Overdue';
    }
  }
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000)) % 24;
  
  if (days > 0) {
    return `in ${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return 'Soon';
  }
};

export const getPriorityColor = (priority: CareReminder['priority']): string => {
  switch (priority) {
    case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getFeedingNotification = (feeding: FeedingSchedule): string => {
  return `🐠 Time to feed ${feeding.foodType.toLowerCase()}! Give ${feeding.amount}.`;
};

export const getReminderNotification = (reminder: CareReminder): string => {
  return `⏰ Reminder: ${reminder.title} - ${reminder.description}`;
};