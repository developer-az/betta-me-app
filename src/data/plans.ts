export type PlanId = 'free' | 'pro' | 'care';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  cta: string;
  highlighted?: boolean;
  features: PlanFeature[];
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Starter',
    tagline: 'Everything you need to begin keeping a healthy betta.',
    monthly: 0,
    yearly: 0,
    cta: 'Start free',
    features: [
      { label: '1 tank and 1 betta profile', included: true },
      { label: 'Health score and water alerts', included: true },
      { label: 'Feeding and water-change log (7 days)', included: true },
      { label: 'Core care guides', included: true },
      { label: 'Water trend charts', included: false },
      { label: 'PDF health reports', included: false },
      { label: 'Partner shop discounts', included: false },
      { label: 'Disease protocols and expert library', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For keepers who want history, insights, and fewer surprises.',
    monthly: 6.99,
    yearly: 59,
    cta: 'Upgrade to Pro',
    highlighted: true,
    features: [
      { label: 'Up to 5 tanks and bettas', included: true },
      { label: 'Unlimited care history', included: true },
      { label: 'Water trend charts and reminders', included: true },
      { label: 'PDF health reports for vets', included: true },
      { label: '10% off partner products', included: true },
      { label: 'Advanced diagnostics', included: true },
      { label: 'Priority email support', included: true },
      { label: 'Expert disease protocols', included: false },
    ],
  },
  {
    id: 'care',
    name: 'Care+',
    tagline: 'Clinical-grade guidance when something looks wrong.',
    monthly: 12.99,
    yearly: 99,
    cta: 'Get Care+',
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Unlimited tanks', included: true },
      { label: 'Disease identification library', included: true },
      { label: 'Step-by-step treatment protocols', included: true },
      { label: '15% shop credit on partner gear', included: true },
      { label: 'Setup reviews and care plans', included: true },
      { label: 'Priority chat support', included: true },
      { label: 'Early access to new tools', included: true },
    ],
  },
];

export const PLAN_ORDER: PlanId[] = ['free', 'pro', 'care'];

export function getPlan(id: PlanId): Plan {
  return PLANS.find((plan) => plan.id === id) || PLANS[0];
}

export function formatPrice(amount: number): string {
  if (amount === 0) return '$0';
  return `$${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
}

export function yearlySavings(plan: Plan): number {
  if (plan.monthly === 0) return 0;
  return Math.round((plan.monthly * 12 - plan.yearly) * 100) / 100;
}
