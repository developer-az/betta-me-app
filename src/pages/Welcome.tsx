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
          <button onClick={() => navigate('/tank')} className="inline-flex items-center justify-center rounded-xl bg-primary text-white font-bold text-lg px-6 py-3 shadow hover:shadow-md transition">
            Start Your Adventure
          </button>
        </div>
      </motion.div>
    </Layout>
  );
}



