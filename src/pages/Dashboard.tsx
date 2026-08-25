import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { TankSVG, FishSVG } from '../components/Visuals';
import { useData } from '../components/DataProvider';
import LoadingSpinner from '../components/LoadingSpinner';
import QuickActions from '../components/QuickActions';
import OnboardingChecklist from '../components/OnboardingChecklist';
import RemindersPanel from '../components/RemindersPanel';
import { analyzeWaterHealth, analyzeFishHealth, getHealthScore, getHealthScoreDescription } from '../lib/healthAlerts';
import { AlertTriangleIcon, CheckCircleIcon, ChartIcon, CartIcon } from '../components/Icons';
import { recommendProducts } from '../data/products';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { loadSettings } from '../lib/settings';
import { formatTemperature } from '../lib/units';
import { waterChangeService, feedingLogService } from '../lib/database';

export default function DashboardPage() {
  const { tank, fish, water, loading } = useData();
  const navigate = useNavigate();
  const { isPro, shopDiscount } = useSubscription();
  const { user, isGuestMode } = useAuth();
  const tempUnit = loadSettings().preferences.temperatureUnit;
  const [fishPos, setFishPos] = React.useState(0.45);
  const [fishDir, setFishDir] = React.useState(1);
  const [fishTime, setFishTime] = React.useState(0);
  const [lastFeedDays, setLastFeedDays] = React.useState<number | null>(null);
  const [lastChangeDays, setLastChangeDays] = React.useState<number | null>(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFishTime((t) => t + 0.03);
      setFishPos((pos) => {
        let next = pos + 0.004 * fishDir;
        if (next > 0.92) {
          setFishDir(-1);
          next = 0.92;
        } else if (next < 0.08) {
          setFishDir(1);
          next = 0.08;
        }
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [fishDir]);

  React.useEffect(() => {
    const loadCadence = async () => {
      try {
        if (user) {
          const [feeds, changes] = await Promise.all([
            feedingLogService.getFeedingLogs(user.id, 1),
            waterChangeService.getLastWaterChange(user.id),
          ]);
          if (feeds[0]) {
            setLastFeedDays(Math.floor((Date.now() - new Date(feeds[0].created_at).getTime()) / 86400000));
          }
          if (changes) {
            setLastChangeDays(Math.floor((Date.now() - new Date(changes.created_at).getTime()) / 86400000));
          }
        } else if (isGuestMode) {
          const feeds = JSON.parse(localStorage.getItem('guestFeedingLogs') || '[]');
          const changes = JSON.parse(localStorage.getItem('guestWaterChanges') || '[]');
          if (feeds[0]) setLastFeedDays(Math.floor((Date.now() - new Date(feeds[0].created_at).getTime()) / 86400000));
          if (changes[0]) setLastChangeDays(Math.floor((Date.now() - new Date(changes[0].created_at).getTime()) / 86400000));
        }
      } catch {
        /* cadence is optional */
      }
    };
    loadCadence();
  }, [user, isGuestMode]);

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner size="lg" text="Loading your habitat…" />
        </div>
      </Layout>
    );
  }

  const waterAlerts = analyzeWaterHealth(water);
  const fishAlerts = analyzeFishHealth(fish);
  const allAlerts = [...waterAlerts, ...fishAlerts];
  const healthScore = getHealthScore(fish, water);
  const healthMeta = getHealthScoreDescription(healthScore);
  const issueKeys = [
    ...allAlerts.map((a) => a.category),
    !tank.heater ? 'heater' : '',
    !tank.filter ? 'filter' : '',
    tank.size < 5 ? 'size' : '',
    water.ammonia > 0 ? 'ammonia' : '',
    water.temperature < 75 || water.temperature > 82 ? 'temp' : '',
  ].filter(Boolean);
  const recs = recommendProducts(issueKeys, 3);

  const tankWidth = 280;
  const tankHeight = 160;
  const fishWidth = 72;
  const fishLeft = fishPos * (tankWidth - fishWidth);

  const parameters = [
    {
      label: 'Temperature',
      value: formatTemperature(water.temperature, tempUnit),
      ok: water.temperature >= 75 && water.temperature <= 82,
    },
    {
      label: 'pH',
      value: water.pH.toFixed(1),
      ok: water.pH >= 6.5 && water.pH <= 7.5,
    },
    {
      label: 'Ammonia',
      value: `${water.ammonia} ppm`,
      ok: water.ammonia === 0,
    },
    {
      label: 'Nitrate',
      value: `${water.nitrate} ppm`,
      ok: water.nitrate <= 20,
    },
  ];

  return (
    <Layout currentStep="/dashboard">
      {isGuestMode && !user && (
        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-brand-200 bg-brand-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-semibold text-brand-900">You are in guest mode</div>
            <p className="text-sm text-brand-800">Create a free account to sync care history across devices.</p>
          </div>
          <button
            onClick={() => navigate('/signup')}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Save progress
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="eyebrow">Overview</div>
          <h1 className="display mt-1 text-4xl">
            {fish.name ? fish.name : 'Your habitat'}
          </h1>
          <p className="mt-1 text-ink-600 dark:text-cream-100/70">
            {healthMeta.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-ink-500">
            <span>Last feeding: {lastFeedDays === null ? 'not logged' : lastFeedDays === 0 ? 'today' : `${lastFeedDays}d ago`}</span>
            <span>Last water change: {lastChangeDays === null ? 'not logged' : lastChangeDays === 0 ? 'today' : `${lastChangeDays}d ago`}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/insights')}
          className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold dark:border-white/10 dark:bg-ink-800"
        >
          <ChartIcon className="h-4 w-4" />
          View insights
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <OnboardingChecklist />
        </div>
        <div className="lg:col-span-7">
          <RemindersPanel />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-6 lg:col-span-4">
          <div className="text-sm font-semibold text-ink-500">BettaScore</div>
          <div className="mt-2 flex items-end gap-3">
            <div className="font-display text-6xl leading-none">{healthScore}</div>
            <div className={`mb-1 rounded-full px-3 py-1 text-xs font-semibold ${
              healthScore >= 80 ? 'bg-brand-50 text-brand-800' : healthScore >= 60 ? 'bg-amber-50 text-amber-800' : 'bg-coral-50 text-coral-700'
            }`}>
              {healthMeta.level}
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
            <div
              className="h-full rounded-full bg-brand-600"
              style={{ width: `${healthScore}%` }}
            />
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Habitat</dt>
              <dd className="font-semibold">{tank.size} gal · {tank.heater ? 'Heated' : 'No heater'} · {tank.filter ? 'Filtered' : 'No filter'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Appetite</dt>
              <dd className="font-semibold">{fish.appetite}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Fins</dt>
              <dd className="font-semibold">{fish.finCondition}</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-6 lg:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl">{fish.name || 'Unnamed betta'}</h2>
              <p className="text-sm text-ink-500">Live habitat view</p>
            </div>
            <button onClick={() => navigate('/tank')} className="text-sm font-semibold text-brand-700">Edit habitat</button>
          </div>
          <div className="relative mx-auto w-full max-w-md" style={{ height: tankHeight }}>
            <TankSVG size={20} />
            <motion.div
              animate={{
                x: fishLeft,
                y: 48 + 10 * Math.sin(fishTime * 1.6),
                scaleX: fishDir === 1 ? 1 : -1,
              }}
              transition={{ type: 'spring', stiffness: 50, damping: 18 }}
              style={{ position: 'absolute', top: 0, left: 0, width: fishWidth, pointerEvents: 'none' }}
            >
              <FishSVG color={fish.color || '#e11d48'} mood={healthScore >= 75 ? 'happy' : 'sad'} />
            </motion.div>
          </div>
        </motion.div>

        {parameters.map((item) => (
          <div key={item.label} className="surface-card p-5 lg:col-span-3">
            <div className="text-sm text-ink-500">{item.label}</div>
            <div className="mt-1 font-display text-3xl">{item.value}</div>
            <div className={`mt-2 text-xs font-semibold ${item.ok ? 'text-brand-700' : 'text-coral-600'}`}>
              {item.ok ? 'In range' : 'Needs attention'}
            </div>
          </div>
        ))}

        <div className="surface-card p-6 lg:col-span-12">
          <h2 className="font-display text-2xl">Log care</h2>
          <p className="mt-1 text-sm text-ink-500">The fastest path to a useful history.</p>
          <div className="mt-5">
            <QuickActions />
          </div>
        </div>

        <div className="surface-card p-6 lg:col-span-7">
          <div className="flex items-center gap-3">
            {allAlerts.length ? (
              <AlertTriangleIcon className="h-5 w-5 text-coral-600" />
            ) : (
              <CheckCircleIcon className="h-5 w-5 text-brand-600" />
            )}
            <h2 className="font-display text-2xl">{allAlerts.length ? 'Alerts' : 'All clear'}</h2>
          </div>
          {allAlerts.length === 0 ? (
            <p className="mt-3 text-sm text-ink-600 dark:text-cream-100/70">
              Water and behavior are in a healthy range. Keep the weekly test habit.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {allAlerts.slice(0, 5).map((alert) => (
                <li key={alert.id} className="rounded-2xl border border-ink-900/5 p-4 dark:border-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">{alert.title}</div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{alert.type}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-600 dark:text-cream-100/70">{alert.message}</p>
                  <p className="mt-2 text-sm text-brand-800 dark:text-brand-200">{alert.recommendation}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface-card p-6 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Recommended gear</h2>
            <CartIcon className="h-5 w-5 text-brand-700" />
          </div>
          <p className="mt-1 text-sm text-ink-500">
            Matched to this habitat{shopDiscount ? ` · ${Math.round(shopDiscount * 100)}% member pricing` : ''}.
          </p>
          <ul className="mt-4 space-y-3">
            {recs.map((product) => (
              <li key={product.id} className="flex gap-3">
                <img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{product.name}</div>
                  <div className="text-sm text-ink-500">${(product.price * (1 - shopDiscount)).toFixed(2)}</div>
                </div>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noreferrer sponsored"
                  className="self-center text-sm font-semibold text-brand-700"
                >
                  Shop
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate('/app/shop')}
            className="mt-5 w-full rounded-full bg-ink-900 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-ink-900"
          >
            Open shop
          </button>
        </div>
      </div>

      {!isPro && (
        <div className="mt-8">
          <div className="rounded-3xl bg-ink-950 p-6 text-cream-50 sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-brand-300">Pro</div>
              <h3 className="font-display text-2xl">Charts catch problems Google cannot.</h3>
              <p className="mt-1 text-sm text-white/70">Unlimited history, PDF reports, and 10% off partner gear.</p>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-4 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white sm:mt-0"
            >
              Upgrade
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
