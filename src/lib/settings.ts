export type TemperatureUnit = 'fahrenheit' | 'celsius';

export interface AppSettings {
  notifications: {
    healthAlerts: boolean;
    waterReminders: boolean;
    feedingReminders: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
  preferences: {
    temperatureUnit: TemperatureUnit;
    theme: 'light' | 'dark' | 'auto';
  };
  onboardingDismissed: boolean;
}

export const defaultAppSettings: AppSettings = {
  notifications: {
    healthAlerts: true,
    waterReminders: true,
    feedingReminders: true,
  },
  privacy: {
    dataSharing: false,
    analytics: false,
  },
  preferences: {
    temperatureUnit: 'fahrenheit',
    theme: 'auto',
  },
  onboardingDismissed: false,
};

const KEY = 'bettame-settings';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultAppSettings };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      ...defaultAppSettings,
      ...parsed,
      notifications: { ...defaultAppSettings.notifications, ...(parsed.notifications || {}) },
      privacy: { ...defaultAppSettings.privacy, ...(parsed.privacy || {}) },
      preferences: { ...defaultAppSettings.preferences, ...(parsed.preferences || {}) },
    };
  } catch {
    return { ...defaultAppSettings };
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
