import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FishSVG } from '../components/Visuals';
import { useData } from '../components/DataProvider';
import { PageSkeleton } from '../components/ui';
import { useDraft } from '../hooks/useDraft';

const COLORS = ['#e11d48', '#2563eb', '#0d9488', '#d97706', '#7c3aed', '#ea580c'];

export default function FishPage() {
  const { fish, setFish, loading } = useData();
  const [draft, setDraft, dirty] = useDraft(fish);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const persistAndGo = async (path: string) => {
    if (!draft.name) return;
    if (!dirty) {
      navigate(path);
      return;
    }
    setSaving(true);
    const ok = await setFish(draft);
    setSaving(false);
    if (ok) navigate(path);
  };

  if (loading) {
    return (
      <Layout>
        <PageSkeleton />
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
    onChange: (value: string) => void;
    options: string[];
  }) => (
    <label className="block text-sm font-medium">
      {label}
      <select
        className="field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <div className="eyebrow">Betta</div>
        <h1 className="display mt-2 text-4xl">Health profile</h1>
        <p className="mt-2 text-ink-600 dark:text-cream-100/70">
          A two-minute check-in is enough for BettaScore to catch appetite, fin, and behavior changes.
        </p>

        <div className="mt-6 flex justify-center">
          <FishSVG color={draft.color} mood="happy" />
        </div>

        <div className="surface-card mt-8 space-y-6 p-6">
          <div>
            <label className="text-sm font-medium" htmlFor="betta-name">Name</label>
            <input
              id="betta-name"
              className="field"
              placeholder="e.g. Indigo"
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            />
            <div className="mt-3 text-sm font-medium">Color</div>
            <div className="mt-2 flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  onClick={() => setDraft({ ...draft, color })}
                  className={`h-8 w-8 rounded-full border-2 ${draft.color === color ? 'border-ink-900 dark:border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fin condition" value={draft.finCondition} options={['Healthy', 'Fin rot', 'Torn', 'Clamped']} onChange={(value) => setDraft({ ...draft, finCondition: value })} />
            <Field label="Coloration" value={draft.colorCondition} options={['Vibrant', 'Faded', 'Spots']} onChange={(value) => setDraft({ ...draft, colorCondition: value })} />
            <Field label="Gills / breathing" value={draft.gillCondition} options={['Normal', 'Rapid', 'Gasping']} onChange={(value) => setDraft({ ...draft, gillCondition: value })} />
            <Field label="Body" value={draft.bodyCondition} options={['Normal', 'Thin', 'Bloated']} onChange={(value) => setDraft({ ...draft, bodyCondition: value })} />
            <Field label="Appetite" value={draft.appetite} options={['Eating well', 'Not eating']} onChange={(value) => setDraft({ ...draft, appetite: value })} />
            <Field label="Activity" value={draft.activity} options={['Normal', 'Lethargic', 'Hyperactive']} onChange={(value) => setDraft({ ...draft, activity: value })} />
            <Field label="Behavior" value={draft.behavior} options={['Normal', 'Hiding', 'Aggressive']} onChange={(value) => setDraft({ ...draft, behavior: value })} />
          </div>
          {dirty && <p className="text-sm text-ink-500">Unsaved health check. Nothing is written until you save.</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="btn-primary"
            onClick={() => persistAndGo('/water')}
            disabled={!draft.name || saving}
          >
            {saving ? 'Saving…' : 'Save and log water'}
          </button>
          <button
            className="btn-secondary"
            disabled={!draft.name || saving}
            onClick={() => persistAndGo('/dashboard')}
          >
            Overview
          </button>
        </div>
      </div>
    </Layout>
  );
}
