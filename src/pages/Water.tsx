import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FishSVG } from '../components/Visuals';
import { useData } from '../components/DataProvider';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeWaterHealth } from '../lib/healthAlerts';
import { useDraft } from '../hooks/useDraft';

function roundTo(value: number, step: number): number {
  const precision = step < 1 ? 1 : 0;
  const rounded = Math.round(value / step) * step;
  return Number(rounded.toFixed(precision));
}

export default function WaterPage() {
  const { water, setWater, fish, loading } = useData();
  const [draft, setDraft, dirty] = useDraft(water);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const persistAndGo = async (path: string) => {
    if (!dirty) {
      navigate(path);
      return;
    }
    setSaving(true);
    const ok = await setWater(draft);
    setSaving(false);
    if (ok) navigate(path);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner size="lg" text="Loading water data…" />
        </div>
      </Layout>
    );
  }

  const alerts = analyzeWaterHealth(draft);
  const happy = alerts.every((alert) => alert.type !== 'critical');

  const Slider = ({
    label,
    value,
    display,
    min,
    max,
    step,
    hint,
    onChange,
  }: {
    label: string;
    value: number;
    display: string;
    min: number;
    max: number;
    step: number;
    hint: string;
    onChange: (value: number) => void;
  }) => (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className="font-display text-xl">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(roundTo(Number(event.target.value), step))}
        className="slider mt-2 w-full"
      />
      <div className="mt-1 text-xs text-ink-500">{hint}</div>
    </div>
  );

  return (
    <Layout>
      <div className="mx-auto max-w-xl">
        <div className="eyebrow">Water chemistry</div>
        <h1 className="display mt-2 text-4xl">Log a test</h1>
        <p className="mt-2 text-ink-600 dark:text-cream-100/70">
          Use a liquid kit. Strips miss ammonia and routinely lie about nitrate. Saving records one test in your history.
        </p>

        <div className="mt-6 flex justify-center">
          <FishSVG color={fish.color} mood={happy ? 'happy' : 'sad'} />
        </div>

        <div className="surface-card mt-8 space-y-5 p-6">
          <Slider
            label="Temperature"
            value={draft.temperature}
            display={`${draft.temperature}°F`}
            min={70}
            max={88}
            step={1}
            hint="Target 76–80°F"
            onChange={(value) => setDraft({ ...draft, temperature: value })}
          />
          <Slider
            label="pH"
            value={draft.pH}
            display={draft.pH.toFixed(1)}
            min={5}
            max={9}
            step={0.1}
            hint="Target 6.5–7.5"
            onChange={(value) => setDraft({ ...draft, pH: value })}
          />
          <Slider
            label="Ammonia"
            value={draft.ammonia}
            display={`${draft.ammonia} ppm`}
            min={0}
            max={2}
            step={0.1}
            hint="Must be 0"
            onChange={(value) => setDraft({ ...draft, ammonia: value })}
          />
          <Slider
            label="Nitrite"
            value={draft.nitrite}
            display={`${draft.nitrite} ppm`}
            min={0}
            max={2}
            step={0.1}
            hint="Must be 0"
            onChange={(value) => setDraft({ ...draft, nitrite: value })}
          />
          <Slider
            label="Nitrate"
            value={draft.nitrate}
            display={`${draft.nitrate} ppm`}
            min={0}
            max={40}
            step={1}
            hint="Keep under 20 ppm"
            onChange={(value) => setDraft({ ...draft, nitrate: value })}
          />
          {dirty && <p className="text-sm text-ink-500">This test is not in your history until you save it.</p>}
        </div>

        {alerts.length > 0 && (
          <div className="mt-4 rounded-2xl border border-coral-200 bg-coral-50 p-4 text-sm text-coral-800 dark:border-coral-900 dark:bg-coral-950/40 dark:text-coral-100">
            {alerts[0].title}: {alerts[0].recommendation}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            disabled={saving}
            onClick={() => persistAndGo('/dashboard')}
          >
            {saving ? 'Saving…' : dirty ? 'Save test' : 'View overview'}
          </button>
          <button
            className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold dark:border-white/15"
            disabled={saving}
            onClick={() => persistAndGo('/insights')}
          >
            Insights
          </button>
        </div>
      </div>
    </Layout>
  );
}
