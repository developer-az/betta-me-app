import { supabase } from './supabase';

export type HealthLevel = 'pass' | 'warn' | 'fail' | 'skip';

export interface HealthCheck {
  id: string;
  label: string;
  level: HealthLevel;
  detail: string;
}

export interface HealthReport {
  checkedAt: string;
  score: number;
  checks: HealthCheck[];
  readyForProduction: boolean;
}

function envPresent(name: string): boolean {
  const value = process.env[name];
  return Boolean(value && !value.includes('your_supabase') && value !== 'demo-anon-key' && value !== 'https://demo.supabase.co');
}

export async function runProductionHealthChecks(): Promise<HealthReport> {
  const checks: HealthCheck[] = [];

  const urlOk = envPresent('REACT_APP_SUPABASE_URL');
  const keyOk = envPresent('REACT_APP_SUPABASE_ANON_KEY');

  checks.push({
    id: 'env-url',
    label: 'Supabase URL configured',
    level: urlOk ? 'pass' : 'fail',
    detail: urlOk ? 'REACT_APP_SUPABASE_URL is set' : 'Missing or placeholder REACT_APP_SUPABASE_URL',
  });

  checks.push({
    id: 'env-key',
    label: 'Supabase anon key configured',
    level: keyOk ? 'pass' : 'fail',
    detail: keyOk ? 'REACT_APP_SUPABASE_ANON_KEY is set' : 'Missing or placeholder REACT_APP_SUPABASE_ANON_KEY',
  });

  if (urlOk && keyOk) {
    try {
      const start = performance.now();
      const { error } = await supabase.auth.getSession();
      const ms = Math.round(performance.now() - start);
      checks.push({
        id: 'auth-session',
        label: 'Auth API reachable',
        level: error ? 'warn' : 'pass',
        detail: error ? error.message : `Responded in ${ms}ms`,
      });
    } catch (err: any) {
      checks.push({
        id: 'auth-session',
        label: 'Auth API reachable',
        level: 'fail',
        detail: err?.message || 'Network error talking to Supabase Auth',
      });
    }

    const tables = ['profiles', 'tanks', 'fish', 'water_readings', 'feeding_logs', 'water_changes'] as const;
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id', { count: 'exact', head: true });
        if (!error) {
          checks.push({
            id: `table-${table}`,
            label: `Table ${table}`,
            level: 'pass',
            detail: 'Reachable under RLS',
          });
        } else if (error.code === '42P01' || /does not exist|relation/i.test(error.message)) {
          checks.push({
            id: `table-${table}`,
            label: `Table ${table}`,
            level: 'fail',
            detail: 'Missing — run supabase/production-schema.sql',
          });
        } else if (error.code === 'PGRST301' || /jwt|api key/i.test(error.message)) {
          checks.push({
            id: `table-${table}`,
            label: `Table ${table}`,
            level: 'fail',
            detail: error.message,
          });
        } else {
          // Permission denied for anon without session is still "table exists + RLS working"
          checks.push({
            id: `table-${table}`,
            label: `Table ${table}`,
            level: /permission|rls|row-level/i.test(error.message) ? 'pass' : 'warn',
            detail: error.message,
          });
        }
      } catch (err: any) {
        checks.push({
          id: `table-${table}`,
          label: `Table ${table}`,
          level: 'fail',
          detail: err?.message || 'Request failed',
        });
      }
    }
  } else {
    checks.push({
      id: 'schema',
      label: 'Schema probe',
      level: 'skip',
      detail: 'Skipped until env credentials are configured',
    });
  }

  try {
    localStorage.setItem('bettame-health-probe', '1');
    localStorage.removeItem('bettame-health-probe');
    checks.push({
      id: 'local-storage',
      label: 'Local storage available',
      level: 'pass',
      detail: 'Guest mode and preferences can persist',
    });
  } catch {
    checks.push({
      id: 'local-storage',
      label: 'Local storage available',
      level: 'warn',
      detail: 'Blocked — guest mode and offline prefs will not persist',
    });
  }

  checks.push({
    id: 'service-worker',
    label: 'Service worker support',
    level: 'serviceWorker' in navigator ? 'pass' : 'warn',
    detail: 'serviceWorker' in navigator ? 'PWA offline shell available' : 'No service worker in this browser',
  });

  const fails = checks.filter((c) => c.level === 'fail').length;
  const warns = checks.filter((c) => c.level === 'warn').length;
  const passes = checks.filter((c) => c.level === 'pass').length;
  const scored = passes + warns + fails;
  const score = scored === 0 ? 0 : Math.round((passes / scored) * 100);

  return {
    checkedAt: new Date().toISOString(),
    score,
    checks,
    readyForProduction: fails === 0 && urlOk && keyOk,
  };
}
