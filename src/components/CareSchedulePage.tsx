import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { 
  FeedingSchedule, 
  CareReminder, 
  defaultFeedingSchedule, 
  defaultCareReminders,
  getTodaysFeedings,
  getUpcomingReminders,
  getOverdueReminders,
  formatTimeRemaining,
  getPriorityColor,
  markReminderComplete
} from '../lib/careSchedule';
import { ClockIcon, BellIcon, CheckCircleIcon, AlertTriangleIcon } from './Icons';

export default function CareSchedulePage() {
  const [feedingSchedule, setFeedingSchedule] = useState<FeedingSchedule[]>(defaultFeedingSchedule);
  const [careReminders, setCareReminders] = useState<CareReminder[]>(defaultCareReminders);
  
  const todaysFeedings = getTodaysFeedings(feedingSchedule);
  const upcomingReminders = getUpcomingReminders(careReminders, 7);
  const overdueReminders = getOverdueReminders(careReminders);

  const handleCompleteReminder = (reminderId: string) => {
    setCareReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? markReminderComplete(reminder)
          : reminder
      )
    );
  };

  const toggleFeedingSchedule = (feedingId: string) => {
    setFeedingSchedule(prev =>
      prev.map(feeding =>
        feeding.id === feedingId
          ? { ...feeding, enabled: !feeding.enabled }
          : feeding
      )
    );
  };

  const toggleReminder = (reminderId: string) => {
    setCareReminders(prev =>
      prev.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, enabled: !reminder.enabled }
          : reminder
      )
    );
  };

  return (
    <Layout currentStep="/care">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Care Schedule
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage feeding schedules and care reminders for your betta
          </p>
        </div>

        {/* Alert section for overdue items */}
        {overdueReminders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangleIcon className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
                Urgent Care Needed
              </h2>
            </div>
            <div className="grid gap-3">
              {overdueReminders.slice(0, 3).map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-red-200 dark:border-red-800"
                >
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-slate-200">
                      {reminder.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatTimeRemaining(reminder.nextDue)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCompleteReminder(reminder.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Mark Complete
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Today's Feeding Schedule */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <ClockIcon className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Today's Feeding Schedule
              </h2>
            </div>

            <div className="space-y-4">
              {todaysFeedings.length > 0 ? (
                todaysFeedings.map((feeding) => (
                  <div
                    key={feeding.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      feeding.enabled
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-800 dark:text-slate-200">
                        {feeding.time} - {feeding.amount}
                      </h3>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={feeding.enabled}
                          onChange={() => toggleFeedingSchedule(feeding.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Enabled
                        </span>
                      </label>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {feeding.foodType}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <ClockIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No feeding scheduled for today</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-3">
                All Feeding Times
              </h3>
              <div className="grid gap-2">
                {feedingSchedule.map((feeding) => (
                  <div
                    key={feeding.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-600 dark:text-slate-400">
                      {feeding.time} - {feeding.amount}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      feeding.enabled
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {feeding.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Care Reminders */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <BellIcon className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Upcoming Care Reminders
              </h2>
            </div>

            <div className="space-y-4">
              {upcomingReminders.length > 0 ? (
                upcomingReminders.slice(0, 5).map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      reminder.enabled
                        ? getPriorityColor(reminder.priority)
                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-800 dark:text-slate-200">
                          {reminder.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {reminder.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                          Due {formatTimeRemaining(reminder.nextDue)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleCompleteReminder(reminder.id)}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200"
                          title="Mark as complete"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                        <label className="cursor-pointer">
                          <input
                            type="checkbox"
                            checked={reminder.enabled}
                            onChange={() => toggleReminder(reminder.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <BellIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming reminders</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-3">
                Care Tips
              </h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <p>• Feed your betta 2-3 pellets twice daily</p>
                <p>• Change 25% of water weekly</p>
                <p>• Test water parameters weekly</p>
                <p>• Clean filter media bi-weekly</p>
                <p>• Maintain temperature between 75-82°F</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <button className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200">
              <ClockIcon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Add Feeding Time</div>
            </button>
            <button className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors duration-200">
              <BellIcon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Add Reminder</div>
            </button>
            <button className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors duration-200">
              <CheckCircleIcon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Mark All Complete</div>
            </button>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}