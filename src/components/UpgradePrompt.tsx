import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CrownIcon, LockIcon } from './Icons';

export default function UpgradePrompt({
  title,
  body,
  plan = 'Pro',
}: {
  title: string;
  body: string;
  plan?: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="surface-card relative overflow-hidden p-6 sm:p-8">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-400/20" />
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
          <LockIcon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="eyebrow">{plan} feature</div>
          <h3 className="mt-1 font-display text-2xl">{title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-600 dark:text-cream-100/70">{body}</p>
          <button
            onClick={() => navigate('/pricing')}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-button hover:bg-brand-700"
          >
            <CrownIcon className="h-4 w-4" />
            See plans
          </button>
        </div>
      </div>
    </div>
  );
}
