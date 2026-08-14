import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FishSVG } from '../components/Visuals';
import { useData } from '../components/DataProvider';
import LoadingSpinner from '../components/LoadingSpinner';

export default function FishPage() {
  const { fish, setFish, loading } = useData();
  const navigate = useNavigate();
  const colors = ['#e11d48', '#2563eb', '#0d9488', '#d97706', '#7c3aed', '#ea580c'];

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner size="lg" text="Loading betta profile…" />
        </div>
      </Layout>
    );
  }

  const Field = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
  }) => (
    <label className="block text-sm font-medium">
      {label}
      <select
        className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );

  return (
    <Layout currentStep="/fish">
      <div className="mx-auto max-w-2xl">
        <div className="eyebrow">Betta</div>
        <h1 className="display mt-2 text-4xl">Health profile</h1>
        <p className="mt-2 text-ink-600 dark:text-cream-100/70">
          A two-minute check-in is enough for BettaScore to catch appetite, fin, and behavior changes.
        </p>

        <div className="mt-6 flex justify-center">
          <FishSVG color={fish.color} mood="happy" />
        </div>

        <div className="surface-card mt-8 space-y-6 p-6">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
              placeholder="e.g. Indigo"
              value={fish.name}
              onChange={(e) => setFish({ ...fish, name: e.target.value })}
            />
            <div className="mt-3 text-sm font-medium">Color</div>
            <div className="mt-2 flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  aria-label={c}
                  onClick={() => setFish({ ...fish, color: c })}
                  className={`h-8 w-8 rounded-full border-2 ${fish.color === c ? 'border-ink-900 dark:border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fin condition" value={fish.finCondition} options={['Healthy', 'Fin rot', 'Torn', 'Clamped']} onChange={(v) => setFish({ ...fish, finCondition: v })} />
            <Field label="Coloration" value={fish.colorCondition} options={['Vibrant', 'Faded', 'Spots']} onChange={(v) => setFish({ ...fish, colorCondition: v })} />
            <Field label="Gills / breathing" value={fish.gillCondition} options={['Normal', 'Rapid', 'Gasping']} onChange={(v) => setFish({ ...fish, gillCondition: v })} />
            <Field label="Body" value={fish.bodyCondition} options={['Normal', 'Bloated', 'Thin']} onChange={(v) => setFish({ ...fish, bodyCondition: v })} />
            <Field label="Appetite" value={fish.appetite} options={['Eating well', 'Not eating']} onChange={(v) => setFish({ ...fish, appetite: v })} />
            <Field label="Activity" value={fish.activity} options={['Normal', 'Lethargic', 'Hyperactive']} onChange={(v) => setFish({ ...fish, activity: v })} />
            <Field label="Behavior" value={fish.behavior} options={['Normal', 'Hiding', 'Aggressive']} onChange={(v) => setFish({ ...fish, behavior: v })} />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            onClick={() => navigate('/water')}
            disabled={!fish.name}
          >
            Continue to water test
          </motion.button>
          <button className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold dark:border-white/15" onClick={() => navigate('/dashboard')}>
            Overview
          </button>
        </div>
      </div>
    </Layout>
  );
}
