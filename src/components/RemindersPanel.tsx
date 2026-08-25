import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CareReminder,
  defaultCareReminders,
  formatTimeRemaining,
  getOverdueReminders,
  getUpcomingReminders,
  markReminderComplete,
} from '../lib/careSchedule';
import { ClockIcon, CheckCircleIcon } from './Icons';
import { loadSettings } from '../lib/settings';

const STORAGE_KEY = 'bettame-reminders';

function loadReminders(): CareReminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCareReminders.map((r) => ({ ...r, nextDue: new Date(r.nextDue) }));
    const parsed = JSON.parse(raw) as CareReminder[];
    return parsed.map((r) => ({
      ...r,
      nextDue: new Date(r.nextDue),
      lastCompleted: r.lastCompleted ? new Date(r.lastCompleted) : undefined,
    }));
  } catch {
    return defaultCareReminders.map((r) => ({ ...r, nextDue: new Date(r.nextDue) }));
  }
}

function persist(reminders: CareReminder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

export default function RemindersPanel() {
  const settings = loadSettings();
  const [reminders, setReminders] = React.useState<CareReminder[]>(loadReminders);
  const navigate = useNavigate();

  if (!settings.notifications.waterReminders && !settings.notifications.feedingReminders) {
    return null;
  }

  const overdue = getOverdueReminders(reminders);
  const upcoming = getUpcomingReminders(reminders, 7).filter((r) => !overdue.includes(r));
  const visible = [...overdue, ...upcoming].slice(0, 4);

  const complete = (id: string) => {
    setReminders((prev) => {
      const next = prev.map((r) => (r.id === id ? markReminderComplete(r) : r));
      persist(next);
      return next;
    });
  };

  return (
    <div className="surface-card p-6">
      <div className="flex items-center gap-2">
        <ClockIcon className="h-5 w-5 text-brand-700" />
        <h2 className="font-display text-2xl">Care reminders</h2>
      </div>
      <p className="mt-1 text-sm text-ink-500">Due soon and overdue maintenance for this habitat.</p>
      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-ink-600">Nothing due in the next week. Nice work.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((reminder) => {
            const isOverdue = overdue.includes(reminder);
            return (
              <li
                key={reminder.id}
                className={`rounded-2xl border p-3 ${
                  isOverdue ? 'border-coral-200 bg-coral-50/60' : 'border-ink-900/8'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{reminder.title}</div>
                    <div className="text-xs text-ink-500">{formatTimeRemaining(reminder.nextDue)}</div>
                    <div className="mt-1 text-sm text-ink-600">{reminder.description}</div>
                  </div>
                  <button
                    onClick={() => complete(reminder.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    Done
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <button
        onClick={() => navigate('/care')}
        className="mt-4 text-sm font-semibold text-brand-700"
      >
        Open care log
      </button>
    </div>
  );
}
