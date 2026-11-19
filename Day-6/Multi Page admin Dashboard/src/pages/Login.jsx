import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from '../components/Icons';

export const Login = () => {
  const [email, setEmail] = useState('admin@nexus.dev');
  const [password, setPassword] = useState('password123');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }

    try {
      login(email, password, remember);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Authentication failed. Check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-indigo-600/30">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Nexus Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your administrative account</p>
        </div>

        {location.state?.from && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-lg">
            Please log in to access this page.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="admin@nexus.dev"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>
            <span className="text-slate-400">Demo: any password works</span>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm shadow-lg shadow-indigo-600/30 transition-all duration-200"
          >
            Sign In &rarr;
          </button>
        </form>
      </div>
    </div>
  );
};
