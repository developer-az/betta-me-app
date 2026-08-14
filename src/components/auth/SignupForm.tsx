import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { signUp, signOut, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (user) {
      setError('You are already signed in. Sign out first to create another account.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Use at least 6 characters');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password);
    if (signUpError) setError(signUpError.message);
    else setMessage('Check your email for a confirmation link, then sign in.');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-ink-900/8 bg-white p-8 shadow-soft">
        <Logo />
        <h1 className="display mt-6 text-3xl">Create your workspace</h1>
        <p className="mt-2 text-sm text-ink-600">Starter is free. Upgrade later if you want history, charts, and shop pricing.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-200 px-4 py-3"
              placeholder="you@studio.com"
              autoComplete="email"
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-200 px-4 py-3"
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </label>
          <label className="block text-sm font-medium">
            Confirm password
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-200 px-4 py-3"
              autoComplete="new-password"
            />
          </label>
          {error && <div className="rounded-xl bg-coral-50 px-3 py-2 text-sm text-coral-700">{error}</div>}
          {message && <div className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800">{message}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create free account'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-ink-600">
          {user ? (
            <button onClick={() => signOut()} className="font-semibold text-coral-600">
              Sign out to create a new account
            </button>
          ) : (
            <>
              Already registered? <Link to="/login" className="font-semibold text-brand-700">Sign in</Link>
            </>
          )}
        </div>
        <p className="mt-2 text-center text-sm">
          <Link to="/" className="text-ink-500">Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
