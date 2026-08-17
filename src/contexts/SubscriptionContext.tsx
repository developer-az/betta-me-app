import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BillingCycle, PlanId, getPlan } from '../data/plans';

const STORAGE_KEY = 'bettame-subscription';

export interface SubscriptionState {
  planId: PlanId;
  cycle: BillingCycle;
  renewsOn: string | null;
}

interface SubscriptionContextType {
  planId: PlanId;
  cycle: BillingCycle;
  renewsOn: string | null;
  isPaid: boolean;
  isPro: boolean;
  isCare: boolean;
  canUseHistory: boolean;
  canExport: boolean;
  canUseInsights: boolean;
  canUsePremiumGuides: boolean;
  shopDiscount: number;
  activatePlan: (planId: PlanId, cycle: BillingCycle) => void;
  cancelToFree: () => void;
}

const defaultState: SubscriptionState = {
  planId: 'free',
  cycle: 'monthly',
  renewsOn: null,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

function readStoredState(): SubscriptionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as SubscriptionState;
    if (!parsed.planId) return defaultState;
    return parsed;
  } catch {
    return defaultState;
  }
}

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SubscriptionState>(defaultState);

  useEffect(() => {
    setState(readStoredState());
  }, []);

  const persist = useCallback((next: SubscriptionState) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const activatePlan = useCallback((planId: PlanId, cycle: BillingCycle) => {
    const renews = new Date();
    renews.setMonth(renews.getMonth() + (cycle === 'yearly' ? 12 : 1));
    persist({
      planId,
      cycle,
      renewsOn: planId === 'free' ? null : renews.toISOString(),
    });
  }, [persist]);

  const cancelToFree = useCallback(() => persist(defaultState), [persist]);

  const value = useMemo<SubscriptionContextType>(() => {
    const isPro = state.planId === 'pro' || state.planId === 'care';
    const isCare = state.planId === 'care';
    return {
      planId: state.planId,
      cycle: state.cycle,
      renewsOn: state.renewsOn,
      isPaid: isPro,
      isPro,
      isCare,
      canUseHistory: isPro,
      canExport: isPro,
      canUseInsights: isPro,
      canUsePremiumGuides: isCare,
      shopDiscount: isCare ? 0.15 : isPro ? 0.1 : 0,
      activatePlan,
      cancelToFree,
    };
  }, [state, activatePlan, cancelToFree]);

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export function planLabel(planId: PlanId): string {
  return getPlan(planId).name;
}
