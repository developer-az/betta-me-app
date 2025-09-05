import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { useAuth } from '../contexts/AuthContext';
import { exportUserData, downloadDataAsJSON, downloadDataAsCSV } from '../lib/dataExport';
import { DownloadIcon, ShieldCheckIcon, BellIcon, UserIcon } from './Icons';

interface UserSettings {
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
    temperatureUnit: 'fahrenheit' | 'celsius';
    theme: 'light' | 'dark' | 'auto';
  };
}

const defaultSettings: UserSettings = {
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
};

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleSettingChange = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleExportData = async (format: 'json' | 'csv') => {
    if (!user) return;
    
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      if (format === 'json') {
        const exportData = await exportUserData(user.id);
        downloadDataAsJSON(exportData);
        setExportStatus('✅ Data exported successfully as JSON');
      } else {
        await downloadDataAsCSV(user.id);
        setExportStatus('✅ Water readings exported successfully as CSV');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('❌ Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Layout currentStep="/settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Settings & Privacy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account, data, and app preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Information */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserIcon className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Account
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400">
                  {user?.email || 'No email available'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  User ID
                </label>
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 font-mono text-xs">
                  {user?.id || 'No ID available'}
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Data Export */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <DownloadIcon className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Data Export
              </h2>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Download your betta care data for backup or transfer to another app.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleExportData('json')}
                disabled={isExporting}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export All Data (JSON)'}
              </button>
              
              <button
                onClick={() => handleExportData('csv')}
                disabled={isExporting}
                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export Water Data (CSV)'}
              </button>
              
              {exportStatus && (
                <div className="text-sm text-center py-2">
                  {exportStatus}
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <BellIcon className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Notifications
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Health Alerts
                </label>
                <input
                  type="checkbox"
                  checked={settings.notifications.healthAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'healthAlerts', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Water Testing Reminders
                </label>
                <input
                  type="checkbox"
                  checked={settings.notifications.waterReminders}
                  onChange={(e) => handleSettingChange('notifications', 'waterReminders', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Feeding Reminders
                </label>
                <input
                  type="checkbox"
                  checked={settings.notifications.feedingReminders}
                  onChange={(e) => handleSettingChange('notifications', 'feedingReminders', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Privacy
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                    Anonymous Data Sharing
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Help improve the app with anonymous usage data
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.dataSharing}
                  onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                    Analytics
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Allow performance and usage analytics
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.analytics}
                  onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mt-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Preferences
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Temperature Unit
              </label>
              <select
                value={settings.preferences.temperatureUnit}
                onChange={(e) => handleSettingChange('preferences', 'temperatureUnit', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fahrenheit">Fahrenheit (°F)</option>
                <option value="celsius">Celsius (°C)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Theme
              </label>
              <select
                value={settings.preferences.theme}
                onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="auto">Auto (System)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}