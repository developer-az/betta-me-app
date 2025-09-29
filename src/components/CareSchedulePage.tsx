import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { useAuth } from '../contexts/AuthContext';
import { useData } from './DataProvider';
import { feedingLogService, waterChangeService, getOrCreateTankId } from '../lib/database';
import { FeedingLog, WaterChange } from '../types';
import { ClockIcon, PlusIcon, DropIcon, FishIcon, CheckCircleIcon } from './Icons';

export default function CareSchedulePage() {
  const { user, isGuestMode } = useAuth();
  const { tank } = useData();
  const [activeTab, setActiveTab] = useState<'feeding' | 'water'>('feeding');
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([]);
  const [waterChanges, setWaterChanges] = useState<WaterChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount and when user changes
  useEffect(() => {
    loadData();
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

  return (
    <Layout currentStep="/care">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Care Log
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track feeding times and water changes to keep your betta healthy
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-slate-100 dark:bg-slate-700 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('feeding')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'feeding'
                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <PlusIcon className="w-5 h-5" />
            Feeding Log
          </button>
          <button
            onClick={() => setActiveTab('water')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'water'
                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <DropIcon className="w-5 h-5" />
            Water Changes
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={loadData}
              className="mt-2 text-sm text-red-700 dark:text-red-300 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-slate-600 dark:text-slate-400">Loading care data...</span>
          </div>
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
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FishIcon className="h-6 w-6 text-green-500" />
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Recent Feedings
                  </h2>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {feedingLogs.length} entries
                </div>
              </div>

              {feedingLogs.length === 0 ? (
                <div className="text-center py-8">
                  <FishIcon className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No feeding logs yet</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Use the Quick Actions to log your first feeding</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedingLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {formatDate(log.created_at)} at {formatTime(log.created_at)}
                          </span>
                        </div>
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="ml-6 space-y-1">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-semibold">Food:</span> {log.food_type} • {log.amount}
                        </div>
                        {log.notes && (
                          <div className="text-sm text-slate-600 dark:text-slate-400 italic">
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
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">This Week</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{getFeedingStats().totalFeedings}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Total Feedings</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getFeedingStats().dailyAverage}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Daily Average</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{getFeedingStats().pelletsPercentage}%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Pellets</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{getFeedingStats().treatsPercentage}%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Treats</div>
                    </div>
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
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <DropIcon className="h-6 w-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Water Change History
                  </h2>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {waterChanges.length} changes recorded
                </div>
              </div>

              {waterChanges.length === 0 ? (
                <div className="text-center py-8">
                  <DropIcon className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No water changes recorded yet</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Use the Quick Actions to log your first water change</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {waterChanges.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {formatDate(log.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                            {log.percentage}% changed
                          </span>
                          <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                        </div>
                      </div>
                      {log.notes && (
                        <div className="ml-6 text-sm text-slate-600 dark:text-slate-400 italic">
                          "{log.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Stats Summary */}
              {waterChanges.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Maintenance Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getWaterChangeStats().daysSinceLast}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Days Since Last</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{getWaterChangeStats().avgPercentage}%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Average Change</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{getWaterChangeStats().frequency}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Day Frequency</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {getWaterChangeStats().isOnSchedule ? '✓' : '!'}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {getWaterChangeStats().isOnSchedule ? 'On Schedule' : 'Overdue'}
                      </div>
                    </div>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Days Since Last</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">27%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Average Change</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">7</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Day Frequency</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">✓</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">On Schedule</div>
                  </div>
                </div>
              </div>

              {/* Next Reminder */}
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <div className="font-medium text-amber-800 dark:text-amber-200">
                      Next water change recommended
                    </div>
                    <div className="text-sm text-amber-600 dark:text-amber-400">
                      In 4 days (January 14th) - 25% change recommended
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </>
        )}

        {/* Care Tips */}
        <div className="mt-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Care Tips
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <FishIcon className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-100">Feeding</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Feed 2-3 pellets twice daily. Remove uneaten food after 2 minutes.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <DropIcon className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-100">Water Changes</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Change 25-30% weekly. Use water conditioner and match temperature.
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}