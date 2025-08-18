import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { TankSVG, FishSVG } from '../components/Visuals';
import { WaterState } from '../types';

export default function WaterPage({ water, setWater, fishColor }: { water: WaterState; setWater: (w: WaterState) => void; fishColor: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = (location.state as any)?.fromDashboard;
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowRight') {
        navigate('/dashboard');
      } else if (e.key === 'ArrowLeft') {
        navigate('/fish');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
  const happy =
    water.temperature >= 75 && water.temperature <= 82 &&
    water.pH >= 6.5 && water.pH <= 7.5 &&
    water.ammonia === 0 &&
    water.nitrite === 0 &&
    water.nitrate <= 20;
  return (
    <Layout currentStep="/water">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="flex flex-col items-center justify-center gap-6">
          <h2 className="text-2xl font-bold text-primary"><span role="img" aria-label="water">💧</span> Step 3: Test Your Water</h2>
          <motion.div animate={{ y: [0, -8, 0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <TankSVG />
          </motion.div>
          <motion.div animate={{ y: [0, -10, 0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <FishSVG color={fishColor} mood={happy ? 'happy' : 'sad'} />
          </motion.div>
          <div className="w-full max-w-md rounded-2xl bg-cyan-50/70 dark:bg-slate-800/70 shadow p-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 font-semibold">Temperature (°F): {water.temperature}°F <span className="text-sky-600" title="Optimal range: 75–82°F.">ℹ️</span></div>
              <input type="range" min={70} max={88} value={water.temperature} onChange={e => setWater({ ...water, temperature: Number(e.target.value) })} className="w-full accent-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold">pH: {water.pH.toFixed(1)} <span className="text-sky-600" title="Optimal range: 6.5–7.5.">ℹ️</span></div>
              <input type="range" min={5} max={9} step={0.1} value={water.pH} onChange={e => setWater({ ...water, pH: Number(e.target.value) })} className="w-full accent-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold">Ammonia (ppm): {water.ammonia} <span className="text-sky-600" title="Ammonia should always be 0.">ℹ️</span></div>
              <input type="range" min={0} max={2} step={0.1} value={water.ammonia} onChange={e => setWater({ ...water, ammonia: Number(e.target.value) })} className="w-full accent-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold">Nitrite (ppm): {water.nitrite} <span className="text-sky-600" title="Nitrite should always be 0.">ℹ️</span></div>
              <input type="range" min={0} max={2} step={0.1} value={water.nitrite} onChange={e => setWater({ ...water, nitrite: Number(e.target.value) })} className="w-full accent-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold">Nitrate (ppm): {water.nitrate} <span className="text-sky-600" title="Keep nitrate below 20 ppm.">ℹ️</span></div>
              <input type="range" min={0} max={40} step={1} value={water.nitrate} onChange={e => setWater({ ...water, nitrate: Number(e.target.value) })} className="w-full accent-primary" />
            </div>
          </div>
          <div className="flex gap-3">
            {fromDashboard ? (
              <button className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            ) : (
              <button className="px-5 py-2 rounded-xl bg-primary text-white" onClick={() => navigate('/dashboard')}>Finish: See Your Tank</button>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}



