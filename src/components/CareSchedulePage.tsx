import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { useAuth } from '../contexts/AuthContext';
import { feedingLogService, waterChangeService } from '../lib/database';
import { FeedingLog, WaterChange } from '../types';
import { ClockIcon, PlusIcon, DropIcon, FishIcon, CheckCircleIcon } from './Icons';
import { EmptyState, PageSkeleton } from './ui';

export default function CareSchedulePage() {
  const { user, isGuestMode } = useAuth();
  const [activeTab, setActiveTab] = useState<'feeding' | 'water'>('feeding');
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([]);
  const [waterChanges, setWaterChanges] = useState<WaterChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount and when user changes
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isGuestMode]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (user && !isGuestMode) {
        // Authenticated user - load from Supabase
        const [feedingData, waterChangeData] = await Promise.all([
          feedingLogService.getFeedingLogs(user.id, 20),
          waterChangeService.getWaterChanges(user.id, 10)
        ]);
        setFeedingLogs(feedingData);
        setWaterChanges(waterChangeData);
      } else {
        // Guest mode - load from localStorage
        const guestFeedings = JSON.parse(localStorage.getItem('guestFeedingLogs') || '[]');
        const guestChanges = JSON.parse(localStorage.getItem('guestWaterChanges') || '[]');
        setFeedingLogs(guestFeedings);
        setWaterChanges(guestChanges);
      }
    } catch (err) {
      console.error('Error loading care data:', err);
      setError('Failed to load care data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getFeedingStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekFeedings = feedingLogs.filter(log => new Date(log.created_at) >= weekAgo);
    
    const totalFeedings = thisWeekFeedings.length;
    const dailyAverage = Math.round((totalFeedings / 7) * 10) / 10;
    const pelletsCount = thisWeekFeedings.filter(log => log.food_type.toLowerCase().includes('pellet')).length;
    const pelletsPercentage = totalFeedings > 0 ? Math.round((pelletsCount / totalFeedings) * 100) : 0;
    const treatsPercentage = 100 - pelletsPercentage;

    return { totalFeedings, dailyAverage, pelletsPercentage, treatsPercentage };
  };

  const getWaterChangeStats = () => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentChanges = waterChanges.filter(change => new Date(change.created_at) >= monthAgo);
    
    const avgPercentage = recentChanges.length > 0 
      ? Math.round(recentChanges.reduce((sum, change) => sum + change.percentage, 0) / recentChanges.length)
      : 25;
    
    const lastChange = waterChanges[0];
    const daysSinceLast = lastChange 
      ? Math.floor((now.getTime() - new Date(lastChange.created_at).getTime()) / (24 * 60 * 60 * 1000))
      : 99;
    
    const frequency = recentChanges.length > 0 
      ? Math.round(30 / recentChanges.length)
      : 7;

    const isOnSchedule = daysSinceLast <= frequency;

    return { daysSinceLast, avgPercentage, frequency, isOnSchedule };
  };

  const tabClass = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
      active ? 'chip-active' : 'chip-idle'
    }`;

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-8">
          <div className="eyebrow">Care</div>
          <h1 className="display mt-2 text-4xl">Care log</h1>
          <p className="mt-2 text-ink-600 dark:text-cream-100/70">
            Feeding and water-change history for this habitat.
          </p>
        </div>

        <div className="mb-6 flex gap-2 rounded-full bg-cream-100 p-1 dark:bg-ink-900">
          <button onClick={() => setActiveTab('feeding')} className={tabClass(activeTab === 'feeding')}>
            <PlusIcon className="h-4 w-4" />
            Feeding
          </button>
          <button onClick={() => setActiveTab('water')} className={tabClass(activeTab === 'water')}>
            <DropIcon className="h-4 w-4" />
            Water changes
          </button>
        </div>

        {error && (
          <div className="alert-error mb-6">
            <p>{error}</p>
            <button onClick={loadData} className="mt-2 text-sm font-semibold underline">
              Try again
            </button>
          </div>
        )}

        {isLoading ? (
          <PageSkeleton />
        ) : (
          <>
        {/* Feeding Log Tab */}
        {activeTab === 'feeding' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="surface-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FishIcon className="h-6 w-6 text-brand-600" />
                  <h2 className="font-display text-2xl">Recent feedings</h2>
                </div>
                <div className="text-sm text-ink-500">{feedingLogs.length} entries</div>
              </div>

              {feedingLogs.length === 0 ? (
                <EmptyState
                  icon={<FishIcon className="h-8 w-8" />}
                  title="No feeding logs yet"
                  body="Use Quick Actions on the overview to log the first meal."
                />
              ) : (
                <div className="space-y-4">
                  {feedingLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4 dark:border-brand-900 dark:bg-brand-950/40"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                          <span className="font-medium">
                            {formatDate(log.created_at)} at {formatTime(log.created_at)}
                          </span>
                        </div>
                        <CheckCircleIcon className="h-5 w-5 text-brand-600" />
                      </div>
                      <div className="ml-6 space-y-1">
                        <div className="text-sm text-ink-600 dark:text-cream-100/70">
                          <span className="font-semibold">Food:</span> {log.food_type} • {log.amount}
                        </div>
                        {log.notes && (
                          <div className="text-sm italic text-ink-600 dark:text-cream-100/70">
                            "{log.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats Summary */}
              {feedingLogs.length > 0 && (
                <div className="mt-8 border-t border-ink-900/10 pt-6 dark:border-white/10">
                  <h3 className="mb-4 font-semibold">This week</h3>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      [getFeedingStats().totalFeedings, 'Total feedings'],
                      [getFeedingStats().dailyAverage, 'Daily average'],
                      [`${getFeedingStats().pelletsPercentage}%`, 'Pellets'],
                      [`${getFeedingStats().treatsPercentage}%`, 'Treats'],
                    ].map(([value, label]) => (
                      <div key={String(label)} className="rounded-2xl bg-cream-100 p-3 text-center dark:bg-ink-900">
                        <div className="font-display text-2xl text-brand-700 dark:text-brand-300">{value}</div>
                        <div className="text-sm text-ink-500">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Water Changes Tab */}
        {activeTab === 'water' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="surface-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DropIcon className="h-6 w-6 text-brand-600" />
                  <h2 className="font-display text-2xl">Water change history</h2>
                </div>
                <div className="text-sm text-ink-500">{waterChanges.length} recorded</div>
              </div>

              {waterChanges.length === 0 ? (
                <EmptyState
                  icon={<DropIcon className="h-8 w-8" />}
                  title="No water changes yet"
                  body="Log the first change from Quick Actions on the overview."
                />
              ) : (
                <div className="space-y-4">
                  {waterChanges.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4 dark:border-brand-900 dark:bg-brand-950/40"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                          <span className="font-medium">{formatDate(log.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-800 dark:bg-ink-900 dark:text-brand-200">
                            {log.percentage}% changed
                          </span>
                          <CheckCircleIcon className="h-5 w-5 text-brand-600" />
                        </div>
                      </div>
                      {log.notes && (
                        <div className="ml-6 text-sm italic text-ink-600 dark:text-cream-100/70">
                          "{log.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Stats Summary */}
              {waterChanges.length > 0 && (
                <div className="mt-8 border-t border-ink-900/10 pt-6 dark:border-white/10">
                  <h3 className="mb-4 font-semibold">Maintenance</h3>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      [getWaterChangeStats().daysSinceLast, 'Days since last'],
                      [`${getWaterChangeStats().avgPercentage}%`, 'Average change'],
                      [getWaterChangeStats().frequency, 'Day frequency'],
                      [getWaterChangeStats().isOnSchedule ? 'On time' : 'Overdue', 'Cadence'],
                    ].map(([value, label]) => (
                      <div key={String(label)} className="rounded-2xl bg-cream-100 p-3 text-center dark:bg-ink-900">
                        <div className="font-display text-2xl text-brand-700 dark:text-brand-300">{value}</div>
                        <div className="text-sm text-ink-500">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Reminder */}
              {waterChanges.length > 0 && (
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="font-medium text-amber-800 dark:text-amber-200">
                        {getWaterChangeStats().isOnSchedule ? 'Next water change recommended' : 'Water change overdue'}
                      </div>
                      <div className="text-sm text-amber-600 dark:text-amber-400">
                        {getWaterChangeStats().isOnSchedule 
                          ? `In ${getWaterChangeStats().frequency - getWaterChangeStats().daysSinceLast} days - 25% change recommended`
                          : `${getWaterChangeStats().daysSinceLast - getWaterChangeStats().frequency} days overdue - Water change needed`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
        </>
        )}

        {/* Care Tips */}
        <div className="surface-card mt-6 p-6">
          <h2 className="mb-4 font-display text-2xl">Care tips</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl bg-cream-100 p-4 dark:bg-ink-900">
              <FishIcon className="mt-0.5 h-5 w-5 text-brand-600" />
              <div>
                <div className="font-medium">Feeding</div>
                <div className="text-sm text-ink-600 dark:text-cream-100/70">
                  Feed 2–3 pellets twice daily. Remove uneaten food after 2 minutes.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-cream-100 p-4 dark:bg-ink-900">
              <DropIcon className="mt-0.5 h-5 w-5 text-brand-600" />
              <div>
                <div className="font-medium">Water changes</div>
                <div className="text-sm text-ink-600 dark:text-cream-100/70">
                  Change 25–30% weekly. Condition the new water and match temperature.
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}