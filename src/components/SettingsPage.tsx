import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { useAuth } from '../contexts/AuthContext';
import { exportUserData, downloadDataAsJSON, downloadDataAsCSV } from '../lib/dataExport';
import { DownloadIcon, ShieldCheckIcon, BellIcon, UserIcon, CrownIcon } from './Icons';
import { useSubscription, planLabel } from '../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { AppSettings, loadSettings, saveSettings } from '../lib/settings';
import { useToast } from './Toast';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { planId, cycle, renewsOn, canExport, cancelToFree } = useSubscription();
  const navigate = useNavigate();
  const toast = useToast();
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleSettingChange = (
    section: 'notifications' | 'privacy' | 'preferences',
    key: string,
    value: string | boolean,
  ) => {
    setSettings((prev) => {
      const next: AppSettings = {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
      saveSettings(next);
      return next;
    });
    toast.success('Preference saved');
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
        toast.success('Export ready', 'JSON download started');
      } else {
        await downloadDataAsCSV(user.id);
        setExportStatus('Water readings exported as CSV');
        toast.success('Export ready', 'CSV download started');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('Export failed. Please try again.');
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Sign out failed');
    }
  };

  return (
    <Layout currentStep="/settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-8">
          <div className="eyebrow">Account</div>
          <h1 className="display mt-2 text-4xl">Settings</h1>
          <p className="mt-2 text-ink-600 dark:text-cream-100/70">
            Billing, exports, notifications, privacy, and system status.
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
              className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {planId === 'free' ? 'Upgrade' : 'Change plan'}
            </button>
            {planId !== 'free' && (
              <button
                onClick={() => {
                  cancelToFree();
                  toast.info('Moved to Starter');
                }}
                className="rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold dark:border-white/15"
              >
                Cancel to Starter
              </button>
            )}
            <button
              onClick={() => navigate('/status')}
              className="rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold dark:border-white/15"
            >
              Production status
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="surface-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <UserIcon className="h-6 w-6 text-brand-600" />
              <h2 className="font-display text-2xl">Account</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <div className="rounded-xl bg-ink-50 px-4 py-2 text-sm text-ink-600 dark:bg-ink-900">
                  {user?.email || 'Guest workspace'}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Workspace</label>
                <div className="rounded-xl bg-ink-50 px-4 py-2 text-sm text-ink-600 dark:bg-ink-900">
                  {user ? 'Cloud synced' : 'Local demo workspace'}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full rounded-full bg-coral-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Sign out
              </button>
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <DownloadIcon className="h-6 w-6 text-brand-600" />
              <h2 className="font-display text-2xl">Data export</h2>
            </div>
            <p className="mb-4 text-sm text-ink-500">
              {canExport
                ? 'Download a full backup or a CSV of water readings.'
                : 'CSV and JSON export is included with Pro.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => (canExport ? handleExportData('json') : navigate('/pricing'))}
                disabled={isExporting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                <DownloadIcon className="h-4 w-4" />
                {canExport ? (isExporting ? 'Exporting…' : 'Export all data (JSON)') : 'Unlock JSON export'}
              </button>
              <button
                onClick={() => (canExport ? handleExportData('csv') : navigate('/pricing'))}
                disabled={isExporting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                <DownloadIcon className="h-4 w-4" />
                {canExport ? (isExporting ? 'Exporting…' : 'Export water data (CSV)') : 'Unlock CSV export'}
              </button>
              {exportStatus && <div className="py-2 text-center text-sm">{exportStatus}</div>}
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <BellIcon className="h-6 w-6 text-amber-500" />
              <h2 className="font-display text-2xl">Notifications</h2>
            </div>
            <div className="space-y-4">
              {(
                [
                  ['healthAlerts', 'Health alerts'],
                  ['waterReminders', 'Water testing reminders'],
                  ['feedingReminders', 'Feeding reminders'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type="checkbox"
                    checked={settings.notifications[key]}
                    onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheckIcon className="h-6 w-6 text-brand-700" />
              <h2 className="font-display text-2xl">Privacy</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Anonymous data sharing</div>
                  <p className="text-xs text-ink-500">Help improve recommendations</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.dataSharing}
                  onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Analytics</div>
                  <p className="text-xs text-ink-500">Performance and usage metrics</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.analytics}
                  onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 surface-card p-6">
          <h2 className="mb-4 font-display text-2xl">Preferences</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">
              Temperature unit
              <select
                value={settings.preferences.temperatureUnit}
                onChange={(e) => handleSettingChange('preferences', 'temperatureUnit', e.target.value)}
                className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
              >
                <option value="fahrenheit">Fahrenheit (°F)</option>
                <option value="celsius">Celsius (°C)</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Theme preference
              <select
                value={settings.preferences.theme}
                onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
              >
                <option value="auto">Auto (system)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
