import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import UpgradePrompt from '../components/UpgradePrompt';
import WaterTrendChart, { buildDemoTrend } from '../components/WaterTrendChart';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { waterService } from '../lib/database';
import { localWaterOperations } from '../lib/localData';
import { useData } from '../components/DataProvider';

export default function InsightsPage() {
  const { canUseInsights } = useSubscription();
  const { user, isGuestMode } = useAuth();
  const { water, loading } = useData();
  const [points, setPoints] = React.useState(buildDemoTrend(water));
  const navigate = useNavigate();

  React.useEffect(() => {
    const load = async () => {
      try {
        if (user) {
          const history = await waterService.getWaterHistory(user.id, 14);
          if (history && history.length >= 2) {
            setPoints(
              history
                .slice()
                .reverse()
                .map((row: any) => ({
                  label: new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  temperature: row.temperature,
                  pH: row.ph,
                  nitrate: row.nitrate,
                }))
            );
            return;
          }
        } else if (isGuestMode) {
          const local = localWaterOperations.getAll();
          if (local.length >= 2) {
            setPoints(
              local
                .slice()
                .reverse()
                .slice(-14)
                .map((row) => ({
                  label: new Date(row.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  temperature: row.temperature_f,
                  pH: row.ph,
                  nitrate: row.nitrate_ppm,
                }))
            );
            return;
          }
        }
        setPoints(buildDemoTrend(water));
      } catch {
        setPoints(buildDemoTrend(water));
      }
    };
    load();
  }, [user, isGuestMode, water]);

  if (loading) return <Layout><div className="py-16 text-center text-sm text-ink-500">Loading insights…</div></Layout>;

  return (
    <Layout>
      <div className="mb-8">
        <div className="eyebrow">Insights</div>
        <h1 className="display mt-2 text-4xl">Water trends</h1>
        <p className="mt-2 max-w-2xl text-ink-600 dark:text-cream-100/70">
          Chemistry problems announce themselves in the chart before they announce themselves on the fish.
        </p>
      </div>

      {!canUseInsights ? (
        <UpgradePrompt
          title="Unlock 90-day chemistry history"
          body="Pro keeps every test, charts temperature drift and nitrate creep, and exports a PDF you can hand to a vet."
        />
      ) : (
        <div className="space-y-6">
          <div className="surface-card p-6">
            <h2 className="font-display text-2xl">Last two weeks</h2>
            <div className="mt-4">
              <WaterTrendChart points={points} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <button onClick={() => navigate('/water')} className="surface-card p-5 text-left hover:shadow-lift">
              <div className="text-sm font-semibold text-brand-700">Log a test</div>
              <p className="mt-1 text-sm text-ink-600 dark:text-cream-100/70">Add today’s reading to the trend.</p>
            </button>
            <button onClick={() => navigate('/care')} className="surface-card p-5 text-left hover:shadow-lift">
              <div className="text-sm font-semibold text-brand-700">Water changes</div>
              <p className="mt-1 text-sm text-ink-600 dark:text-cream-100/70">See if your cadence matches nitrate.</p>
            </button>
            <button onClick={() => navigate('/app/shop')} className="surface-card p-5 text-left hover:shadow-lift">
              <div className="text-sm font-semibold text-brand-700">Need a kit?</div>
              <p className="mt-1 text-sm text-ink-600 dark:text-cream-100/70">Liquid tests beat strips. Every time.</p>
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
