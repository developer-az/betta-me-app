import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { TankSVG } from '../components/Visuals';
import { useData } from '../components/DataProvider';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TankPage() {
  const { tank, setTank, loading } = useData();
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <LoadingSpinner size="lg" text="Loading your tank data..." />
      </div>
    );
  }
  
  return (
    <Layout currentStep="/tank">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="flex flex-col items-center justify-center gap-8">
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent text-center"
          >
            <span role="img" aria-label="tank" className="mr-3">🏠</span>
            Step 1: Create Your Perfect Tank
          </motion.h2>
          
          <motion.div 
            animate={{ y: [0, -8, 0, 8, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="drop-shadow-lg"
          >
            <TankSVG size={tank.size} />
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-lg rounded-3xl bg-gradient-to-br from-cyan-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm shadow-glass border border-cyan-200/60 dark:border-slate-600/60 p-6"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-slate-700 dark:text-slate-200">Tank Size: {tank.size} gallons</span>
                  <span className="text-2xl cursor-help" title="A larger tank provides a more stable environment for your betta.">💡</span>
                </div>
                <div className="relative">
                  <input 
                    type="range" 
                    min={1} 
                    max={20} 
                    value={tank.size} 
                    onChange={e => setTank({ ...tank, size: Number(e.target.value) })} 
                    className="w-full h-3 bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-slate-600 dark:to-slate-500 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #3b82f6 ${(tank.size / 20) * 100}%, #e2e8f0 ${(tank.size / 20) * 100}%, #e2e8f0 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span>1 gal</span>
                    <span>20 gal</span>
                  </div>
                </div>
                {tank.size < 3 && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      <div>
                        <strong>Warning:</strong> A tank smaller than 3 gallons is not recommended for bettas. Consider upgrading for better health and happiness.
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="flex gap-8 justify-center">
                <motion.label 
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 hover:shadow-soft transition-all duration-300 cursor-pointer"
                >
                  <input 
                    type="checkbox" 
                    checked={tank.heater} 
                    onChange={e => setTank({ ...tank, heater: e.target.checked })} 
                    className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-200">🔥 Heater</span>
                </motion.label>
                <motion.label 
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 hover:shadow-soft transition-all duration-300 cursor-pointer"
                >
                  <input 
                    type="checkbox" 
                    checked={tank.filter} 
                    onChange={e => setTank({ ...tank, filter: e.target.checked })} 
                    className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-200">🌊 Filter</span>
                </motion.label>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            {fromDashboard ? (
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-700/80 transition-all duration-300 font-medium hover:shadow-soft" 
                onClick={() => navigate('/dashboard')}
              >
                ← Back to Dashboard
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-button hover:shadow-button-hover font-medium" 
                onClick={() => navigate('/fish')} 
                disabled={tank.size < 1}
              >
                Next: Add Your Betta →
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}



