import React from 'react';

export interface TrendPoint {
  label: string;
  temperature: number;
  pH: number;
  nitrate: number;
}

export default function WaterTrendChart({ points }: { points: TrendPoint[] }) {
  if (points.length < 2) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500 dark:border-white/10">
        Log at least two water tests to see trends.
      </div>
    );
  }

  const width = 640;
  const height = 220;
  const pad = 28;

  const series = [
    { key: 'temperature' as const, color: '#e11d48', min: 70, max: 88, label: 'Temp °F' },
    { key: 'pH' as const, color: '#0d9488', min: 5, max: 9, label: 'pH' },
    { key: 'nitrate' as const, color: '#d97706', min: 0, max: 40, label: 'Nitrate' },
  ];

  const x = (i: number) => pad + (i * (width - pad * 2)) / (points.length - 1);
  const y = (value: number, min: number, max: number) =>
    height - pad - ((value - min) / (max - min)) * (height - pad * 2);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={pad}
            x2={width - pad}
            y1={pad + t * (height - pad * 2)}
            y2={pad + t * (height - pad * 2)}
            stroke="currentColor"
            className="text-ink-200 dark:text-white/10"
          />
        ))}
        {series.map((s) => {
          const d = points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p[s.key], s.min, s.max)}`)
            .join(' ');
          return <path key={s.key} d={d} fill="none" stroke={s.color} strokeWidth="2.5" />;
        })}
        {points.map((p, i) => (
          <text
            key={p.label}
            x={x(i)}
            y={height - 8}
            textAnchor="middle"
            className="fill-ink-500 text-[10px]"
          >
            {p.label}
          </text>
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-ink-600 dark:text-cream-100/70">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function buildDemoTrend(current: { temperature: number; pH: number; nitrate: number }): TrendPoint[] {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  return labels.map((label, i) => {
    const t = i / 6;
    return {
      label,
      temperature: Math.round((current.temperature - 1.5 + t * 1.8) * 10) / 10,
      pH: Math.round((current.pH - 0.2 + t * 0.25) * 10) / 10,
      nitrate: Math.max(0, Math.round(current.nitrate + 8 - t * 9)),
    };
  });
}
