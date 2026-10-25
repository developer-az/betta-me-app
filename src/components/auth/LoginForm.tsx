import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../brand/Logo';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: signInError } = await signIn(email, password);
    if (signInError) setError(signInError.message);
    else navigate('/dashboard');
    setLoading(false);
  };

  const handleReset = async () => {
    setError('');
    setNotice('');
    if (!email) {
      setError('Enter your email and we will send a reset link.');
      return;
    }
    setLoading(true);
    const { error: resetError } = await resetPassword(email);
    setLoading(false);
    if (resetError) setError(resetError.message);
    else setNotice('Check your email for a reset link.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-ink-900/8 bg-white p-8 shadow-soft">
        <Logo />
        <h1 className="display mt-6 text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-600">Sign in to sync tanks, history, and member pricing.</p>
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
              placeholder="Your password"
              autoComplete="current-password"
            />
          </label>
          {error && <div className="rounded-xl bg-coral-50 px-3 py-2 text-sm text-coral-700">{error}</div>}
          {notice && <div className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800">{notice}</div>}
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-semibold text-brand-700"
          >
            Forgot password?
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-600">
          New here? <Link to="/signup" className="font-semibold text-brand-700">Create a free account</Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to="/" className="text-ink-500">Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
