import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FishSVG } from '../components/Visuals';
import { useData } from '../components/DataProvider';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeWaterHealth } from '../lib/healthAlerts';

export default function WaterPage() {
  const { water, setWater, fish, loading } = useData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner size="lg" text="Loading water data…" />
        </div>
      </Layout>
    );
  }

  const alerts = analyzeWaterHealth(water);
  const happy = alerts.every((a) => a.type !== 'critical');

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
    onChange: (n: number) => void;
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
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider mt-2 w-full"
      />
      <div className="mt-1 text-xs text-ink-500">{hint}</div>
    </div>
  );

  return (
    <Layout currentStep="/water">
      <div className="mx-auto max-w-xl">
        <div className="eyebrow">Water chemistry</div>
        <h1 className="display mt-2 text-4xl">Log a test</h1>
        <p className="mt-2 text-ink-600 dark:text-cream-100/70">
          Use a liquid kit. Strips miss ammonia and routinely lie about nitrate.
        </p>

        <div className="mt-6 flex justify-center">
          <FishSVG color={fish.color} mood={happy ? 'happy' : 'sad'} />
        </div>

        <div className="surface-card mt-8 space-y-5 p-6">
          <Slider
            label="Temperature"
            value={water.temperature}
            display={`${water.temperature}°F`}
            min={70}
            max={88}
            step={1}
            hint="Target 76–80°F"
            onChange={(n) => setWater({ ...water, temperature: n })}
          />
          <Slider
            label="pH"
            value={water.pH}
            display={water.pH.toFixed(1)}
            min={5}
            max={9}
            step={0.1}
            hint="Target 6.5–7.5"
            onChange={(n) => setWater({ ...water, pH: n })}
          />
          <Slider
            label="Ammonia"
            value={water.ammonia}
            display={`${water.ammonia} ppm`}
            min={0}
            max={2}
            step={0.1}
            hint="Must be 0"
            onChange={(n) => setWater({ ...water, ammonia: n })}
          />
          <Slider
            label="Nitrite"
            value={water.nitrite}
            display={`${water.nitrite} ppm`}
            min={0}
            max={2}
            step={0.1}
            hint="Must be 0"
            onChange={(n) => setWater({ ...water, nitrite: n })}
          />
          <Slider
            label="Nitrate"
            value={water.nitrate}
            display={`${water.nitrate} ppm`}
            min={0}
            max={40}
            step={1}
            hint="Keep under 20 ppm"
            onChange={(n) => setWater({ ...water, nitrate: n })}
          />
        </div>

        {alerts.length > 0 && (
          <div className="mt-4 rounded-2xl border border-coral-200 bg-coral-50 p-4 text-sm text-coral-800 dark:border-coral-900 dark:bg-coral-950/40 dark:text-coral-100">
            {alerts[0].title}: {alerts[0].recommendation}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white" onClick={() => navigate('/dashboard')}>
            Save and view overview
          </button>
          <button className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold dark:border-white/15" onClick={() => navigate('/insights')}>
            Insights
          </button>
        </div>
      </div>
    </Layout>
  );
}
