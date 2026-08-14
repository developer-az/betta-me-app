import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { TankSVG } from '../components/Visuals';
import { useData } from '../components/DataProvider';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TankPage() {
  const { tank, setTank, loading } = useData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner size="lg" text="Loading habitat…" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentStep="/tank">
      <div className="mx-auto max-w-2xl">
        <div className="eyebrow">Habitat</div>
        <h1 className="display mt-2 text-4xl">Tank setup</h1>
        <p className="mt-2 text-ink-600 dark:text-cream-100/70">
          Five gallons is the floor. Heat and filtration are not optional if you want stable chemistry.
        </p>

        <div className="mt-8 flex justify-center">
          <TankSVG size={tank.size} />
        </div>

        <div className="surface-card mt-8 p-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Volume</span>
            <span className="font-display text-2xl">{tank.size} gal</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={tank.size}
            onChange={(e) => setTank({ ...tank, size: Number(e.target.value) })}
            className="slider mt-4 w-full"
          />
          <div className="mt-2 flex justify-between text-xs text-ink-500">
            <span>1 gal</span>
            <span>20 gal</span>
          </div>
          {tank.size < 5 && (
            <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-100">
              {tank.size < 3
                ? 'Tanks under 3 gallons crash quickly and are not recommended.'
                : 'Five gallons is the minimum we recommend for a single betta.'}
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-ink-200 px-4 py-3 dark:border-white/10">
              <span className="font-medium">Heater</span>
              <input
                type="checkbox"
                checked={tank.heater}
                onChange={(e) => setTank({ ...tank, heater: e.target.checked })}
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-ink-200 px-4 py-3 dark:border-white/10">
              <span className="font-medium">Filter</span>
              <input
                type="checkbox"
                checked={tank.filter}
                onChange={(e) => setTank({ ...tank, filter: e.target.checked })}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
            onClick={() => navigate('/fish')}
          >
            Continue to betta profile
          </motion.button>
          <button
            className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold dark:border-white/15"
            onClick={() => navigate('/dashboard')}
          >
            Overview
          </button>
        </div>
      </div>
    </Layout>
  );
}
