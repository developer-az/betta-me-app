import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FishSVG } from '../components/Visuals';

export default function WelcomePage() {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault();
        navigate('/tank');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
  return (
    <Layout currentStep="/">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">
            <span role="img" aria-label="betta">🐠</span> Betta Adventure
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 max-w-xl">
            Welcome to your virtual betta fish journey. Create a premium tank, track health, and care with confidence.
          </p>
          <motion.div animate={{ y: [0, -12, 0, 12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <FishSVG color="#64b5f6" mood="happy" />
          </motion.div>
          
          {/* Educational Quick Tips */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.5 }}
              className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
            >
              <div className="text-3xl mb-2">🏠</div>
              <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Tank Setup</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Minimum 2.5 gallons with heater & filter. Bigger is always better for stability!
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5, duration: 0.5 }}
              className="p-4 rounded-xl bg-green-50/80 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
            >
              <div className="text-3xl mb-2">🍽️</div>
              <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">Feeding</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                2-3 pellets twice daily. Overfeeding causes bloating and water quality issues.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.7, duration: 0.5 }}
              className="p-4 rounded-xl bg-purple-50/80 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700"
            >
              <div className="text-3xl mb-2">💧</div>
              <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-2">Water Care</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Weekly 25-50% water changes. Keep ammonia & nitrites at 0, nitrates under 20ppm.
              </p>
            </motion.div>
          </div>
          
          <button onClick={() => navigate('/tank')} className="inline-flex items-center justify-center rounded-xl bg-primary text-white font-bold text-lg px-8 py-4 shadow hover:shadow-md transition mt-6">
            Start Your Adventure
          </button>
        </div>
      </motion.div>
    </Layout>
  );
}



