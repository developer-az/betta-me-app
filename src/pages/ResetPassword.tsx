import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from '../components/brand/Logo';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setReady(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="surface-card w-full max-w-md p-8">
        <Logo />
        <h1 className="display mt-6 text-3xl">Choose a new password</h1>
        <p className="mt-2 text-sm text-ink-600">
          This finishes the reset link from your email and keeps the same account.
        </p>
        {done ? (
          <p className="mt-8 text-sm text-ink-700">
            Password updated.{' '}
            <Link to="/dashboard" className="font-semibold text-brand-700">
              Go to your habitat
            </Link>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {!ready && (
              <p className="rounded-xl bg-cream-100 px-3 py-2 text-sm text-ink-700 dark:bg-ink-900 dark:text-cream-100">
                Open the reset link from your email to continue. The link signs you in just long enough to set a password.
              </p>
            )}
            <label className="block text-sm font-medium">
              New password
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field"
                autoComplete="new-password"
                disabled={!ready || loading}
              />
            </label>
            {error && <div className="alert-error">{error}</div>}
            <button
              type="submit"
              disabled={!ready || loading}
              className="btn-primary w-full"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-ink-500">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
