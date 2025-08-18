import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import { FishIcon, FlaskIcon, HouseIcon, DropIcon, GridIcon, MenuIcon } from './Icons';

export default function Layout({ children, currentStep }: { children: React.ReactNode; currentStep: string }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [dark, setDark] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const navigate = useNavigate();

  const steps = [
    { label: 'Welcome', path: '/', icon: <HouseIcon className="w-5 h-5" /> },
    { label: 'Tank', path: '/tank', icon: <FlaskIcon className="w-5 h-5" /> },
    { label: 'Fish', path: '/fish', icon: <FishIcon className="w-5 h-5" /> },
    { label: 'Water', path: '/water', icon: <DropIcon className="w-5 h-5" /> },
    { label: 'Dashboard', path: '/dashboard', icon: <GridIcon className="w-5 h-5" /> },
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

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <AnimatedBackground />
      <header className="sticky top-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700 shadow-[0_8px_32px_rgba(31,38,135,0.18)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center">
          <button className="sm:hidden mr-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
            <MenuIcon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>
          <div className="flex items-center mr-4">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center mr-2 text-white font-bold">🐠</div>
            <div className="text-2xl font-extrabold tracking-wide text-primary">Betta Me</div>
          </div>
          <nav className="hidden sm:flex gap-3 ml-4">
            {steps.map(step => (
              <button
                key={step.path}
                onClick={() => navigate(step.path)}
                className={`group inline-flex items-center gap-2 px-3 py-2 rounded-none border-b-2 transition-colors ${currentStep === step.path ? 'border-yellow-400 text-primary font-semibold' : 'border-transparent text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-800'}`}
              >
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark(v => !v)} className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
              {dark ? 'Light' : 'Dark'}
            </button>
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">BK</div>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="sm:hidden fixed inset-0 z-30" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 shadow-xl p-3" onClick={e => e.stopPropagation()}>
            <div className="text-lg font-semibold mb-2">Menu</div>
            <ul>
              {steps.map(step => (
                <li key={step.path}>
                  <button
                    onClick={() => { setDrawerOpen(false); navigate(step.path); }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md ${currentStep === step.path ? 'bg-blue-50 text-primary dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {step.icon}
                    <span>{step.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-2 sm:p-6 relative z-10">
        <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-[0_8px_32px_rgba(31,38,135,0.18)] bg-white/75 dark:bg-slate-800/75 backdrop-blur-2xl p-3 sm:p-6 min-h-[500px]">
          {children}
        </div>
      </main>
    </div>
  );
}





