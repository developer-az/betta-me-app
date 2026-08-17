import React from 'react';
import { useNavigate } from 'react-router-dom';
import MarketingLayout from '../components/marketing/MarketingLayout';
import { BillingCycle, PLANS, formatPrice, yearlySavings } from '../data/plans';
import { CheckIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

export default function PricingPage() {
  const [cycle, setCycle] = React.useState<BillingCycle>('yearly');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { planId } = useSubscription();

  const choose = (id: string) => {
    if (id === 'free') {
      navigate(user ? '/dashboard' : '/signup');
      return;
    }
    if (!user) {
      sessionStorage.setItem('bettame-intent-plan', JSON.stringify({ id, cycle }));
      navigate('/signup');
      return;
    }
    navigate(`/checkout?plan=${id}&cycle=${cycle}`);
  };

  return (
    <MarketingLayout>
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow">Pricing</div>
          <h1 className="display mt-3 text-4xl sm:text-5xl">Simple plans. Real outcomes.</h1>
          <p className="mt-4 text-ink-600">
            Starter is free forever for one tank. Pro pays for itself the first time it catches a water crash. Care+ is for keepers who want protocols, not Google.
          </p>
          <div className="mt-8 inline-flex rounded-full border border-ink-200 bg-white p-1">
            {(['monthly', 'yearly'] as BillingCycle[]).map((option) => (
              <button
                key={option}
                onClick={() => setCycle(option)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                  cycle === option ? 'bg-ink-900 text-white' : 'text-ink-600'
                }`}
              >
                {option}
                {option === 'yearly' ? ' · save ~30%' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const price = cycle === 'yearly' ? plan.yearly : plan.monthly;
            const current = planId === plan.id;
            return (
              <div
                key={plan.id}
                className={`flex flex-col rounded-3xl border p-7 ${
                  plan.highlighted ? 'border-brand-600 bg-white shadow-lift' : 'border-ink-900/10 bg-white'
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-700">Most keepers choose this</div>
                )}
                <h2 className="font-display text-3xl">{plan.name}</h2>
                <p className="mt-2 text-sm text-ink-600">{plan.tagline}</p>
                <div className="mt-5 font-display text-5xl">
                  {formatPrice(price)}
                  <span className="text-base font-sans font-medium text-ink-500">
                    {plan.monthly === 0 ? '' : cycle === 'yearly' ? '/yr' : '/mo'}
                  </span>
                </div>
                {cycle === 'yearly' && plan.monthly > 0 && (
                  <div className="mt-1 text-xs text-brand-700">Save {formatPrice(yearlySavings(plan))} versus monthly</div>
                )}
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-2 text-sm">
                      <CheckIcon className={`mt-0.5 h-4 w-4 ${feature.included ? 'text-brand-600' : 'text-ink-300'}`} />
                      <span className={feature.included ? '' : 'text-ink-400'}>{feature.label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => choose(plan.id)}
                  className={`mt-8 rounded-full py-3 text-sm font-semibold ${
                    current ? 'bg-ink-100 text-ink-700' : plan.highlighted ? 'bg-brand-600 text-white' : 'bg-ink-900 text-white'
                  }`}
                >
                  {current ? 'Current plan' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </MarketingLayout>
  );
}
