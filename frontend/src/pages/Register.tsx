import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedUsername) {
      setErr('Username is required');
      return;
    }
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
    if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
      setErr(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    setIsSubmitting(true);
    try {
      await register(trimmedUsername, trimmedEmail, trimmedPassword);
      nav('/editor');
    } catch (e: unknown) {
      if (typeof e === 'object' && e !== null && 'response' in e) {
        const error = e as { response?: { data?: { error?: string } } };
        setErr(error.response?.data?.error || 'REGISTER FAILED');
      } else {
        setErr('REGISTER FAILED');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-2 text-center border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-800">Blogedit</h1>
          <p className="text-sm text-gray-500 mt-1">Create an account</p>
        </div>
        <form onSubmit={onSubmit} className="p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Register</h2>
          {err && <div className="text-red-500 mb-2 text-sm">{err}</div>}
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            className="w-full p-2 bg-green-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600"
          >
            {isSubmitting ? 'Creating account…' : 'REGISTER'}
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
