import React from 'react';
import Layout from '../components/Layout';
import { runProductionHealthChecks, HealthReport } from '../lib/dbHealth';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircleIcon, AlertTriangleIcon } from '../components/Icons';

export default function StatusPage() {
  const [report, setReport] = React.useState<HealthReport | null>(null);
  const [running, setRunning] = React.useState(true);

  const run = React.useCallback(async () => {
    setRunning(true);
    const next = await runProductionHealthChecks();
    setReport(next);
    setRunning(false);
  }, []);

  React.useEffect(() => {
    run();
  }, [run]);

  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        <div className="eyebrow">Operations</div>
        <h1 className="display mt-2 text-4xl">Production readiness</h1>
        <p className="mt-2 text-ink-600 dark:text-cream-100/70">
          Live checks against env config, Auth, table reachability under RLS, and browser capabilities.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={run}
            disabled={running}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {running ? 'Running…' : 'Re-run checks'}
          </button>
          {report && (
            <div className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              report.readyForProduction ? 'bg-brand-50 text-brand-800' : 'bg-coral-50 text-coral-700'
            }`}>
              Score {report.score}/100 · {report.readyForProduction ? 'Ready' : 'Blocked'}
            </div>
          )}
        </div>

        {running && !report ? (
          <div className="mt-12 flex justify-center">
            <LoadingSpinner text="Probing database and auth…" />
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {report?.checks.map((check) => (
              <li key={check.id} className="surface-card flex items-start gap-3 p-4">
                {check.level === 'pass' ? (
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 text-brand-600" />
                ) : (
                  <AlertTriangleIcon
                    className={`mt-0.5 h-5 w-5 ${
                      check.level === 'fail' ? 'text-coral-600' : 'text-amber-500'
                    }`}
                  />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{check.label}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                      {check.level}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-600 dark:text-cream-100/70">{check.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 rounded-3xl border border-ink-900/10 bg-white p-5 text-sm leading-6 text-ink-600 dark:border-white/10 dark:bg-ink-800 dark:text-cream-100/70">
          <p className="font-semibold text-ink-900 dark:text-cream-50">Apply the production schema</p>
          <p className="mt-2">
            In the Supabase SQL editor, run <code className="rounded bg-ink-100 px-1 dark:bg-ink-900">supabase/production-schema.sql</code>,
            then verify with <code className="rounded bg-ink-100 px-1 dark:bg-ink-900">supabase/diagnostics.sql</code>.
          </p>
          <p className="mt-2">
            Set <code className="rounded bg-ink-100 px-1 dark:bg-ink-900">REACT_APP_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-ink-100 px-1 dark:bg-ink-900">REACT_APP_SUPABASE_ANON_KEY</code> in your host environment.
          </p>
        </div>
      </div>
    </Layout>
  );
}
