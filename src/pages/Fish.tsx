import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FishSVG } from '../components/Visuals';
import { FishState } from '../types';

export default function FishPage({ fish, setFish }: { fish: FishState; setFish: (f: FishState) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = (location.state as any)?.fromDashboard;
  const colors = ['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#ba68c8', '#ff8a65'];
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowRight') {
        if (fromDashboard) navigate('/dashboard'); else if (fish.name) navigate('/water');
      } else if (e.key === 'ArrowLeft') {
        if (fromDashboard) navigate('/dashboard'); else navigate('/tank');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fromDashboard, fish.name, navigate]);
  return (
    <Layout currentStep="/fish">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="flex flex-col items-center justify-center gap-6">
          <h2 className="text-2xl font-bold text-primary"><span role="img" aria-label="fish">🐟</span> Step 2: Add Your Betta</h2>
          <motion.div animate={{ y: [0, -10, 0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <FishSVG color={fish.color} mood="happy" />
          </motion.div>
          <div className="w-full max-w-xl rounded-2xl bg-slate-50/80 dark:bg-slate-800/70 shadow p-5 space-y-6">
            <div>
              <div className="font-bold mb-2">General</div>
              <input className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 mb-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" placeholder="Your betta's name" value={fish.name} onChange={e => setFish({ ...fish, name: e.target.value })} />
              <div className="font-semibold mb-2">Color:</div>
              <div className="flex gap-3 justify-center">
                {colors.map(c => (
                  <button key={c} onClick={() => setFish({ ...fish, color: c })} aria-label={c} className={`w-9 h-9 rounded-full border-2 ${fish.color === c ? 'border-slate-800 dark:border-slate-200' : 'border-slate-300 dark:border-slate-600'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div>
              <div className="font-bold mb-2">Appearance</div>
              <label className="block text-sm font-semibold mb-1">Fin Condition</label>
              <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 mb-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value={fish.finCondition} onChange={e => setFish({ ...fish, finCondition: e.target.value })}>
                <option>Healthy</option>
                <option>Fin rot</option>
                <option>Torn</option>
                <option>Clamped</option>
              </select>
              <label className="block text-sm font-semibold mb-1">Coloration</label>
              <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 mb-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value={fish.colorCondition} onChange={e => setFish({ ...fish, colorCondition: e.target.value })}>
                <option>Vibrant</option>
                <option>Faded</option>
                <option>Spots</option>
              </select>
              <label className="block text-sm font-semibold mb-1">Gills/Breathing</label>
              <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 mb-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value={fish.gillCondition} onChange={e => setFish({ ...fish, gillCondition: e.target.value })}>
                <option>Normal</option>
                <option>Rapid</option>
                <option>Gasping</option>
              </select>
              <label className="block text-sm font-semibold mb-1">Body Condition</label>
              <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value={fish.bodyCondition} onChange={e => setFish({ ...fish, bodyCondition: e.target.value })}>
                <option>Normal</option>
                <option>Bloated</option>
                <option>Thin</option>
              </select>
            </div>
            <div>
              <div className="font-bold mb-2">Behavior</div>
              <label className="block text-sm font-semibold mb-1">Appetite</label>
              <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 mb-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value={fish.appetite} onChange={e => setFish({ ...fish, appetite: e.target.value })}>
                <option>Eating well</option>
                <option>Not eating</option>
              </select>
              <label className="block text-sm font-semibold mb-1">Activity</label>
              <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 mb-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value={fish.activity} onChange={e => setFish({ ...fish, activity: e.target.value })}>
                <option>Normal</option>
                <option>Lethargic</option>
                <option>Hyperactive</option>
              </select>
              <label className="block text-sm font-semibold mb-1">Behavior</label>
              <select className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" value={fish.behavior} onChange={e => setFish({ ...fish, behavior: e.target.value })}>
                <option>Normal</option>
                <option>Hiding</option>
                <option>Aggressive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            {fromDashboard ? (
              <button className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            ) : (
              <button className="px-5 py-2 rounded-xl bg-primary text-white disabled:opacity-40" onClick={() => navigate('/water')} disabled={!fish.name}>Next: Test Water</button>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}



