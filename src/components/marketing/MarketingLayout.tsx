import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../brand/Logo';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { label: 'Product', path: '/#product' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Shop', path: '/shop' },
  { label: 'Guides', path: '/guides' },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-cream-50 text-ink-900">
      <header className="sticky top-0 z-30 border-b border-ink-900/5 bg-cream-50/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  location.pathname === item.path
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-600 hover:bg-white hover:text-ink-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-button hover:bg-brand-700"
              >
                Open dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-white"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-button hover:bg-brand-700"
                >
                  Start free
                </button>
              </>
            )}
          </div>
          <button
            className="rounded-xl p-2 md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span className="block h-0.5 w-5 bg-ink-900" />
            <span className="mt-1.5 block h-0.5 w-5 bg-ink-900" />
            <span className="mt-1.5 block h-0.5 w-5 bg-ink-900" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-ink-950/50" />
          <div
            className="absolute right-0 top-0 h-full w-72 bg-cream-50 p-6 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} className="text-sm font-medium">Close</button>
            </div>
            <div className="space-y-2">
              {NAV.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 font-medium hover:bg-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ink-900/10 bg-ink-950 text-cream-50">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo inverted to="/" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            Betta Me is the care platform for keepers who want healthier fish, clearer water, and fewer expensive mistakes.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/shop" className="hover:text-white">Gear shop</Link></li>
            <li><Link to="/guides" className="hover:text-white">Care guides</Link></li>
            <li><Link to="/signup" className="hover:text-white">Create account</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
            <li><a href="mailto:hello@bettame.app" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Betta Me. All rights reserved.</span>
          <span>Affiliate links may earn a commission. Recommendations are editorial.</span>
        </div>
      </div>
    </footer>
  );
}
