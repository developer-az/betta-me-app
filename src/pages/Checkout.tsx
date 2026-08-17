import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MarketingLayout from '../components/marketing/MarketingLayout';
import { BillingCycle, PlanId, formatPrice, getPlan } from '../data/plans';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { CheckIcon } from '../components/Icons';

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const planId = (params.get('plan') as PlanId) || 'pro';
  const cycle = (params.get('cycle') as BillingCycle) || 'yearly';
  const plan = getPlan(planId);
  const { user, enableGuestMode } = useAuth();
  const { activatePlan } = useSubscription();
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'done'>('idle');

  const price = cycle === 'yearly' ? plan.yearly : plan.monthly;

  const pay = async () => {
    setStatus('processing');
    await new Promise((resolve) => setTimeout(resolve, 900));
    if (!user) enableGuestMode();
    activatePlan(planId, cycle);
    setStatus('done');
    setTimeout(() => navigate('/dashboard'), 700);
  };

  return (
    <MarketingLayout>
      <section className="container-page grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <div className="eyebrow">Checkout</div>
          <h1 className="display mt-3 text-4xl">Activate {plan.name}</h1>
          <p className="mt-3 text-ink-600">
            This demo checkout provisions your plan immediately so you can evaluate Pro and Care+ in the product. Connect Stripe in production to charge real cards.
          </p>
          <ul className="mt-8 space-y-2">
            {plan.features.filter((f) => f.included).map((feature) => (
              <li key={feature.label} className="flex gap-2 text-sm">
                <CheckIcon className="mt-0.5 h-4 w-4 text-brand-600" />
                {feature.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{plan.name} · {cycle}</div>
              <div className="text-sm text-ink-500">Billed {cycle}</div>
            </div>
            <div className="font-display text-3xl">{formatPrice(price)}</div>
          </div>
          <div className="mt-6 space-y-3">
            <label className="block text-sm font-medium">
              Name on card
              <input className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2" defaultValue="Alex Rivera" />
            </label>
            <label className="block text-sm font-medium">
              Card number
              <input className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2" defaultValue="4242 4242 4242 4242" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input className="rounded-xl border border-ink-200 bg-white px-3 py-2" defaultValue="12 / 28" />
              <input className="rounded-xl border border-ink-200 bg-white px-3 py-2" defaultValue="123" />
            </div>
          </div>
          <button
            onClick={pay}
            disabled={status !== 'idle'}
            className="mt-6 w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {status === 'idle' && `Pay ${formatPrice(price)}`}
            {status === 'processing' && 'Confirming…'}
            {status === 'done' && 'Plan activated'}
          </button>
          <p className="mt-3 text-xs text-ink-500">
            No charge is processed in this environment. Production billing should use Stripe Checkout or a PCI-compliant processor.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
