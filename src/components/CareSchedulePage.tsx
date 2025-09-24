import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { ClockIcon, PlusIcon, DropIcon, FishIcon, CheckCircleIcon } from './Icons';

// Mock data for demonstration - in a real app this would come from the database
const mockFeedingLogs = [
  { id: '1', date: '2024-01-10', time: '8:30 AM', food: 'Pellets', amount: '2-3 pieces', notes: 'Ate eagerly' },
  { id: '2', date: '2024-01-10', time: '6:00 PM', food: 'Pellets', amount: '2-3 pieces', notes: '' },
  { id: '3', date: '2024-01-09', time: '8:30 AM', food: 'Pellets', amount: '2-3 pieces', notes: '' },
  { id: '4', date: '2024-01-09', time: '6:00 PM', food: 'Bloodworms', amount: 'Small pinch', notes: 'Special treat!' },
];

const mockWaterChangeLogs = [
  { id: '1', date: '2024-01-07', percentage: 25, notes: 'Weekly water change, cleaned filter media' },
  { id: '2', date: '2023-12-31', percentage: 30, notes: 'End of year deep clean' },
  { id: '3', date: '2023-12-24', percentage: 25, notes: 'Regular maintenance' },
];

export default function CareSchedulePage() {
  const [activeTab, setActiveTab] = useState<'feeding' | 'water'>('feeding');

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
                  {mockFeedingLogs.length} entries
                </div>
              </div>

              <div className="space-y-4">
                {mockFeedingLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {formatDate(log.date)} at {log.time}
                        </span>
                      </div>
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="ml-6 space-y-1">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">Food:</span> {log.food} • {log.amount}
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

              {/* Stats Summary */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">This Week</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">14</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Feedings</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Daily Average</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">98%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Pellets</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">2%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Treats</div>
                  </div>
                </div>
              </div>
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
                  {mockWaterChangeLogs.length} changes recorded
                </div>
              </div>

              <div className="space-y-4">
                {mockWaterChangeLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {formatDate(log.date)}
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

              {/* Stats Summary */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Maintenance Stats</h3>
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