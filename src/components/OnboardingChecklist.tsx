import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, XIcon } from './Icons';
import { loadSettings, saveSettings } from '../lib/settings';
import { useData } from './DataProvider';

export default function OnboardingChecklist() {
  const { tank, fish, water } = useData();
  const navigate = useNavigate();
  const [hidden, setHidden] = React.useState(() => loadSettings().onboardingDismissed);

  if (hidden) return null;

  const steps = [
    {
      id: 'tank',
      label: 'Confirm habitat size and equipment',
      done: tank.size >= 5 && tank.heater && tank.filter,
      to: '/tank',
    },
    {
      id: 'fish',
      label: 'Name your betta and set a health baseline',
      done: Boolean(fish.name),
      to: '/fish',
    },
    {
      id: 'water',
      label: 'Log your first water test',
      done: water.ammonia === 0 && water.nitrite === 0,
      to: '/water',
    },
    {
      id: 'feed',
      label: 'Log a feeding from Quick Actions',
      done: false,
      to: '/dashboard',
    },
  ];

  // Feed step: check local guest logs or just leave as optional if others done
  try {
    const guest = JSON.parse(localStorage.getItem('guestFeedingLogs') || '[]');
    if (guest.length > 0) steps[3].done = true;
  } catch {
    /* ignore */
  }

  const remaining = steps.filter((s) => !s.done).length;
  if (remaining === 0) return null;

  const dismiss = () => {
    const settings = loadSettings();
    saveSettings({ ...settings, onboardingDismissed: true });
    setHidden(true);
  };

  return (
    <div className="surface-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow">Getting started</div>
          <h2 className="mt-1 font-display text-2xl">{remaining} step{remaining === 1 ? '' : 's'} left</h2>
          <p className="mt-1 text-sm text-ink-500">A complete baseline makes BettaScore and alerts meaningful.</p>
        </div>
        <button onClick={dismiss} className="rounded-full p-1 text-ink-400 hover:bg-ink-100" aria-label="Dismiss checklist">
          <XIcon className="h-4 w-4" />
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {steps.map((step) => (
          <li key={step.id}>
            <button
              onClick={() => navigate(step.to)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                step.done
                  ? 'border-brand-200 bg-brand-50 text-brand-900'
                  : 'border-ink-900/8 bg-white hover:border-brand-300 dark:bg-ink-900'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  step.done ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-400'
                }`}
              >
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <span className={step.done ? 'line-through opacity-70' : 'font-medium'}>{step.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
