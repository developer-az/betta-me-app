import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { TankSVG } from '../components/Visuals';
import { TankState } from '../types';

export default function TankPage({ tank, setTank }: { tank?: TankState; setTank?: (t: TankState) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = (location.state as any)?.fromDashboard;
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowRight') {
        if (fromDashboard) navigate('/dashboard'); else navigate('/fish');
      } else if (e.key === 'ArrowLeft') {
        if (fromDashboard) navigate('/dashboard'); else navigate('/');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fromDashboard, navigate]);
  return (
    <Layout currentStep="/tank">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="flex flex-col items-center justify-center gap-6">
          <h2 className="text-2xl font-bold text-primary"><span role="img" aria-label="tank">🛁</span> Step 1: Create Your Tank</h2>
          <motion.div animate={{ y: [0, -8, 0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <TankSVG size={tank?.size || 10} />
          </motion.div>
          <div className="w-full max-w-md rounded-2xl bg-cyan-50/70 dark:bg-slate-800/70 shadow p-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Tank Size (gallons): {tank?.size || 10} gal</span>
                  <span className="text-sky-600" title="A larger tank provides a more stable environment for your betta.">ℹ️</span>
                </div>
                <input type="range" min={1} max={20} value={tank?.size || 10} onChange={e => setTank?.({ ...tank!, size: Number(e.target.value) })} className="w-full accent-primary mt-2" />
                {tank && tank.size < 3 && (
                  <div className="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/30 text-red-600 dark:text-red-300 font-semibold">Warning: A tank smaller than 3 gallons is not recommended for bettas. Consider upgrading for better health and happiness.</div>
                )}
              </div>
              <div className="flex gap-6 justify-center">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={tank?.heater || false} onChange={e => setTank?.({ ...tank!, heater: e.target.checked })} />
                  <span>Heater</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={tank?.filter || false} onChange={e => setTank?.({ ...tank!, filter: e.target.checked })} />
                  <span>Filter</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {fromDashboard ? (
              <button className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            ) : (
              <button className="px-5 py-2 rounded-xl bg-primary text-white disabled:opacity-40" onClick={() => navigate('/fish')} disabled={!tank || tank.size < 1}>Next: Add Your Betta</button>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}



