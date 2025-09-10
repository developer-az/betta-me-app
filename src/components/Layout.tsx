import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from './AnimatedBackground';
import { FlaskIcon, HouseIcon, GridIcon, MenuIcon, ClockIcon, UserIcon } from './Icons';

export default function Layout({ children, currentStep }: { children: React.ReactNode; currentStep: string }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [dark, setDark] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const steps = [
    { label: 'Home', path: '/', icon: <HouseIcon className="w-5 h-5" /> },
    { label: 'Dashboard', path: '/dashboard', icon: <GridIcon className="w-5 h-5" /> },
    { label: 'Setup', path: '/tank', icon: <FlaskIcon className="w-5 h-5" /> },
    { label: 'Care Log', path: '/care', icon: <ClockIcon className="w-5 h-5" /> },
    { label: 'Settings', path: '/settings', icon: <UserIcon className="w-5 h-5" /> },
  ];

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-surface-50 via-surface-100 to-accent-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      <AnimatedBackground />
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-glass">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center">
          <button className="sm:hidden mr-2 p-2 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
            <MenuIcon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>
          <div className="flex items-center mr-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mr-3 text-white font-bold shadow-soft">🐠</div>
            <div className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Betta Me</div>
          </div>
          <nav className="hidden sm:flex gap-1 ml-4">
            {steps.map(step => (
              <button
                key={step.path}
                onClick={() => navigate(step.path)}
                className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                  currentStep === step.path 
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-button font-semibold' 
                    : 'text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-soft hover:text-primary-600'
                }`}
              >
                <span className={`transition-transform group-hover:scale-110 ${currentStep === step.path ? 'scale-110' : ''}`}>{step.icon}</span>
                <span>{step.label}</span>
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button 
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} 
              onClick={() => setDark(v => !v)} 
              className="p-2.5 rounded-xl border border-slate-300/60 dark:border-slate-600/60 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-soft transition-all duration-300"
            >
              <span className="text-sm font-medium">{dark ? '☀️' : '🌙'}</span>
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium transition-all duration-300 shadow-button hover:shadow-button-hover"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 rounded-xl border border-slate-300/60 dark:border-slate-600/60 hover:bg-white/60 dark:hover:bg-slate-800/60 text-sm font-medium transition-all duration-300 hover:shadow-soft"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white text-sm font-medium transition-all duration-300 shadow-button hover:shadow-button-hover"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="sm:hidden fixed inset-0 z-30" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute left-0 top-0 h-full w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-glass p-4 border-r border-white/20 dark:border-slate-700/30" onClick={e => e.stopPropagation()}>
            <div className="text-lg font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Menu</div>
            <ul className="space-y-2">
              {steps.map(step => (
                <li key={step.path}>
                  <button
                    onClick={() => { setDrawerOpen(false); navigate(step.path); }}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      currentStep === step.path 
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-soft' 
                        : 'hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-soft'
                    }`}
                  >
                    <span className="transition-transform hover:scale-110">{step.icon}</span>
                    <span className="font-medium">{step.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            
            {/* Auth section in mobile menu */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
              {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {user.email}
                  </div>
                  <button
                    onClick={() => { setDrawerOpen(false); handleSignOut(); }}
                    className="w-full text-left px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-600 dark:text-red-400 hover:from-red-500/20 hover:to-red-600/20 transition-all duration-300 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => { setDrawerOpen(false); handleSignIn(); }}
                    className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setDrawerOpen(false); handleSignUp(); }}
                    className="w-full text-left px-4 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 transition-all duration-300 shadow-soft font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 relative z-10">
        <div className="w-full max-w-4xl mx-auto rounded-3xl shadow-glass bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl p-4 sm:p-8 min-h-[500px] border border-white/20 dark:border-slate-700/30">
          {children}
        </div>
      </main>
    </div>
  );
}





