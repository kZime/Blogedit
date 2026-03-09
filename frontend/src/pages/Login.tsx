import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Check if we're in mock mode
const isMockMode = import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail) {
      setErr('Email is required');
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setErr('Please enter a valid email address');
      return;
    }
    if (!trimmedPassword) {
      setErr('Password is required');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(trimmedEmail, trimmedPassword);
      nav('/editor');
    } catch (e: unknown) {
      if (typeof e === 'object' && e !== null && 'response' in e) {
        // @ts-expect-error: e.response may exist on error objects from axios
        setErr(e.response?.data?.error || 'LOGIN FAILED');
      } else {
        setErr('LOGIN FAILED');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Development skip login function
  const handleSkipLogin = async () => {
    if (!isMockMode) return;
    setErr('');
    setIsSubmitting(true);
    try {
      await login('dev@example.com', 'password');
      nav('/editor');
    } catch (e) {
      console.error('Skip login failed:', e);
      setErr('Skip login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-2 text-center border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-800">Blogedit</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={onSubmit} className="p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Login</h2>
          {err && <div className="text-red-500 mb-2 text-sm">{err}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            {isSubmitting ? 'Logging in…' : 'LOGIN'}
          </button>

          {isMockMode && (
            <button
              type="button"
              onClick={handleSkipLogin}
              className="w-full mt-2 p-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
            >
              DEV: Skip Login (Mock Mode)
            </button>
          )}

          <p className="mt-4 text-sm text-center text-gray-600">
            No account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
