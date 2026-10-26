import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { useAuth } from '../contexts/AuthContext';
import { exportUserData, downloadDataAsJSON, downloadDataAsCSV } from '../lib/dataExport';
import { DownloadIcon, ShieldCheckIcon, BellIcon, UserIcon, CrownIcon } from './Icons';
import { useSubscription, planLabel } from '../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

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
  const { planId, cycle, renewsOn, canExport, cancelToFree } = useSubscription();
  const navigate = useNavigate();
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
        setExportStatus('Data exported as JSON');
      } else {
        await downloadDataAsCSV(user.id);
        setExportStatus('Water readings exported as CSV');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('Export failed. Please try again.');
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
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <div className="eyebrow">Account</div>
          <h1 className="display mt-2 text-4xl">Settings</h1>
          <p className="mt-2 text-ink-600 dark:text-cream-100/70">
            Billing, exports, notifications, and privacy.
          </p>
        </div>

        <div className="mb-6 surface-card p-6">
          <div className="flex items-center gap-3">
            <CrownIcon className="h-6 w-6 text-brand-600" />
            <div>
              <h2 className="font-display text-2xl">Plan</h2>
              <p className="text-sm text-ink-500">
                {planLabel(planId)} · {planId === 'free' ? 'Starter' : cycle}
                {renewsOn ? ` · renews ${new Date(renewsOn).toLocaleDateString()}` : ''}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/pricing')}
              className="btn-primary"
            >
              {planId === 'free' ? 'Upgrade' : 'Change plan'}
            </button>
            {planId !== 'free' && (
              <button
                onClick={cancelToFree}
                className="btn-secondary"
              >
                Cancel to Starter
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Information */}
          <div className="surface-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserIcon className="h-6 w-6 text-blue-500" />
              <h2 className="font-display text-2xl">
                Account
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-cream-100">
                  Email
                </label>
                <div className="rounded-2xl bg-cream-100 px-4 py-2 text-ink-600 dark:bg-ink-900 dark:text-cream-100/80">
                  {user?.email || 'No email available'}
                </div>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-cream-100">
                  Workspace
                </label>
                <div className="rounded-2xl bg-cream-100 px-4 py-2 text-ink-600 dark:bg-ink-900 dark:text-cream-100/80 text-sm">
                  {user ? 'Cloud synced' : 'Local demo workspace'}
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="btn-secondary w-full text-coral-700 dark:text-coral-200"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Data Export */}
          <div className="surface-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <DownloadIcon className="h-6 w-6 text-green-500" />
              <h2 className="font-display text-2xl">
                Data Export
              </h2>
            </div>
            
            <p className="mb-4 text-sm text-ink-600 dark:text-cream-100/70">
              {canExport
                ? 'Download a full backup or a CSV of water readings.'
                : 'CSV and JSON export is included with Pro.'}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => (canExport ? handleExportData('json') : navigate('/pricing'))}
                disabled={isExporting}
                className="btn-primary w-full"
              >
                <DownloadIcon className="h-4 w-4" />
                {canExport ? (isExporting ? 'Exporting…' : 'Export all data (JSON)') : 'Unlock JSON export'}
              </button>
              
              <button
                onClick={() => (canExport ? handleExportData('csv') : navigate('/pricing'))}
                disabled={isExporting}
                className="btn-secondary w-full"
              >
                <DownloadIcon className="h-4 w-4" />
                {canExport ? (isExporting ? 'Exporting…' : 'Export water data (CSV)') : 'Unlock CSV export'}
              </button>
              
              {exportStatus && (
                <div className="text-sm text-center py-2">
                  {exportStatus}
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="surface-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <BellIcon className="h-6 w-6 text-yellow-500" />
              <h2 className="font-display text-2xl">
                Notifications
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-ink-700 dark:text-cream-100">
                  Health Alerts
                </label>
                <input
                  type="checkbox"
                  checked={settings.notifications.healthAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'healthAlerts', e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-ink-700 dark:text-cream-100">
                  Water Testing Reminders
                </label>
                <input
                  type="checkbox"
                  checked={settings.notifications.waterReminders}
                  onChange={(e) => handleSettingChange('notifications', 'waterReminders', e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-ink-700 dark:text-cream-100">
                  Feeding Reminders
                </label>
                <input
                  type="checkbox"
                  checked={settings.notifications.feedingReminders}
                  onChange={(e) => handleSettingChange('notifications', 'feedingReminders', e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="surface-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-purple-500" />
              <h2 className="font-display text-2xl">
                Privacy
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-ink-700 dark:text-cream-100 block">
                    Anonymous Data Sharing
                  </label>
                  <p className="text-xs text-ink-500">
                    Help improve the app with anonymous usage data
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.dataSharing}
                  onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-ink-700 dark:text-cream-100 block">
                    Analytics
                  </label>
                  <p className="text-xs text-ink-500">
                    Allow performance and usage analytics
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.analytics}
                  onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mt-6 surface-card p-6">
          <h2 className="font-display text-2xl mb-4">
            Preferences
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-cream-100 mb-2">
                Temperature Unit
              </label>
              <select
                value={settings.preferences.temperatureUnit}
                onChange={(e) => handleSettingChange('preferences', 'temperatureUnit', e.target.value)}
                className="field"
              >
                <option value="fahrenheit">Fahrenheit (°F)</option>
                <option value="celsius">Celsius (°C)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-cream-100 mb-2">
                Theme
              </label>
              <select
                value={settings.preferences.theme}
                onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                className="field"
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