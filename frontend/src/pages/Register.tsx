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
    <form onSubmit={onSubmit} className="max-w-sm mx-auto p-4">
      <h2 className="text-xl mb-4">REGISTER</h2>
      {err && <div className="text-red-500 mb-2">{err}</div>}
      <input
        placeholder="用户名"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-2 bg-green-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating account…' : 'REGISTER'}
      </button>
      <p className="mt-2 text-sm">
        Already have an account? <Link to="/login" className="text-blue-400">LOGIN</Link>
      </p>
    </form>
  );
}
