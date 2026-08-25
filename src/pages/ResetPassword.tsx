import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/brand/Logo';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { error: resetError } = await resetPassword(email);
    if (resetError) setError(resetError.message);
    else setMessage('If that email exists, a reset link is on the way.');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-ink-900/8 bg-white p-8 shadow-soft">
        <Logo />
        <h1 className="display mt-6 text-3xl">Reset password</h1>
        <p className="mt-2 text-sm text-ink-600">We will email a secure link to choose a new password.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-200 px-4 py-3"
              autoComplete="email"
            />
          </label>
          {error && <div className="rounded-xl bg-coral-50 px-3 py-2 text-sm text-coral-700">{error}</div>}
          {message && <div className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800">{message}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-semibold text-brand-700">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
