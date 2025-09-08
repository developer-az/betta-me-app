import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { FishSVG, TankSVG } from '../components/Visuals';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (user) {
          navigate('/dashboard');
        } else {
          navigate('/signup');
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, user]);

  return (
    <Layout currentStep="/">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-primary-600 via-accent-500 to-primary-700 bg-clip-text text-transparent">
            <motion.span 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
              role="img" 
              aria-label="betta"
            >
              🐠
            </motion.span> 
            Betta Adventure
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Welcome to your virtual betta fish journey. Create a <span className="font-semibold bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent">premium tank</span>, track health, and care with confidence.
          </p>
          <motion.div 
            animate={{ y: [0, -12, 0, 12, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="drop-shadow-lg"
          >
            <FishSVG color="#60a5fa" mood="happy" />
          </motion.div>
          
          {/* Enhanced Tank Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative mb-4"
          >
            <div className="relative">
              <TankSVG size={8} />
              <motion.div
                animate={{ 
                  x: [20, 100, 20],
                  y: [15, 25, 15]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 left-4"
                style={{ width: '32px', height: '16px' }}
              >
                <FishSVG color="#e57373" mood="happy" />
              </motion.div>
            </div>
            <div className="text-center mt-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                🎨 New geometric design with rich aquascaping
              </p>
            </div>
          </motion.div>
          
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')} 
                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-lg px-8 py-4 shadow-button hover:shadow-button-hover transition-all duration-300"
              >
                <span className="mr-2">🚀</span>
                Continue Your Journey
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/tank')} 
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg px-8 py-4 shadow-button hover:shadow-button-hover transition-all duration-300"
              >
                <span className="mr-2">🏠</span>
                Manage Tank
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')} 
                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-lg px-8 py-4 shadow-button hover:shadow-button-hover transition-all duration-300"
              >
                <span className="mr-2">✨</span>
                Start Your Adventure
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')} 
                className="inline-flex items-center justify-center rounded-2xl border-2 border-primary-300 dark:border-primary-600 bg-white/60 dark:bg-slate-800/60 text-primary-600 dark:text-primary-400 font-bold text-lg px-8 py-4 backdrop-blur-sm hover:bg-primary-50/80 dark:hover:bg-slate-700/80 transition-all duration-300 hover:shadow-soft"
              >
                <span className="mr-2">👋</span>
                Sign In
              </motion.button>
            </div>
          )}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-600/60"
          >
            {user ? (
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                Welcome back, <span className="text-primary-600 dark:text-primary-400 font-bold">{user.email}</span>! 🎉
              </p>
            ) : (
              <p className="text-slate-600 dark:text-slate-300">
                Create an account to save your progress and track your betta's health 📊
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}



