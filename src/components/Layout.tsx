import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription, planLabel } from '../contexts/SubscriptionContext';
import { useData } from './DataProvider';
import Logo from './brand/Logo';
import {
  GridIcon,
  FlaskIcon,
  FishIcon,
  DropIcon,
  ClockIcon,
  ChartIcon,
  CartIcon,
  UserIcon,
  MenuIcon,
  CrownIcon,
  XIcon,
} from './Icons';

const NAV = [
  { label: 'Overview', path: '/dashboard', icon: GridIcon, primary: true },
  { label: 'Habitat', path: '/tank', icon: FlaskIcon, primary: true },
  { label: 'Betta', path: '/fish', icon: FishIcon, primary: true },
  { label: 'Water', path: '/water', icon: DropIcon, primary: true },
  { label: 'Care', path: '/care', icon: ClockIcon, primary: true },
  { label: 'Insights', path: '/insights', icon: ChartIcon, primary: false },
  { label: 'Shop', path: '/app/shop', icon: CartIcon, primary: false },
  { label: 'Account', path: '/settings', icon: UserIcon, primary: false },
];

const PRIMARY = NAV.filter((item) => item.primary);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [dark, setDark] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });
  const navigate = useNavigate();
  const { user, signOut, isGuestMode } = useAuth();
  const { planId } = useSubscription();
  const { lastError, clearLastError } = useData();

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

  React.useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const linkClass = (isActive: boolean, compact = false) =>
    `inline-flex items-center gap-2 rounded-full ${compact ? 'px-2.5' : 'px-3'} py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-ink-900 text-white dark:bg-brand-600'
        : 'text-ink-600 hover:bg-white dark:text-cream-100 dark:hover:bg-ink-800'
    }`;

  return (
    <div className="min-h-screen bg-cream-50 text-ink-900 dark:bg-ink-950 dark:text-cream-50">
      <header className="sticky top-0 z-30 border-b border-ink-900/8 bg-cream-50/90 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-3 sm:px-6">
          <button
            className="mr-2 rounded-xl p-2 lg:hidden"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <Logo size={32} />
          <nav className="ml-4 hidden items-center gap-0.5 lg:flex" aria-label="Care">
            {NAV.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.label}
                className={({ isActive }) => linkClass(isActive, !item.primary)}
              >
                <item.icon className="h-4 w-4" />
                <span className={item.primary ? undefined : 'sr-only xl:not-sr-only'}>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate('/pricing')}
              className="hidden items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800 xl:inline-flex dark:border-brand-800 dark:bg-brand-950 dark:text-brand-200"
            >
              <CrownIcon className="h-3.5 w-3.5" />
              {planLabel(planId)}
            </button>
            <button
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setDark((value) => !value)}
              className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-semibold dark:border-white/15"
            >
              {dark ? 'Light' : 'Dark'}
            </button>
            {user ? (
              <button
                onClick={handleSignOut}
                className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-ink-900"
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={() => navigate(isGuestMode ? '/signup' : '/login')}
                className="rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                {isGuestMode ? 'Save progress' : 'Sign in'}
              </button>
            )}
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-ink-950/50" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute left-0 top-0 h-full w-72 bg-cream-50 p-4 shadow-lift dark:bg-ink-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button className="rounded-xl p-2" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-6 space-y-1">
              {NAV.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                        isActive ? 'bg-ink-900 text-white' : 'hover:bg-white dark:hover:bg-ink-800'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl px-3 py-6 pb-24 sm:px-6 sm:py-8 lg:pb-8">
        {lastError && (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-2xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-800 dark:border-coral-900 dark:bg-coral-950/40 dark:text-coral-100">
            <p>{lastError}</p>
            <button className="font-semibold" onClick={clearLastError}>
              Dismiss
            </button>
          </div>
        )}
        {children}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-900/10 bg-cream-50/95 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/95 lg:hidden"
        aria-label="Primary"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {PRIMARY.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-semibold ${
                    isActive ? 'text-brand-700 dark:text-brand-300' : 'text-ink-500'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
