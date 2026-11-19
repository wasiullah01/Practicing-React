import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shield } from '../components/Icons';

/**
 * NotFound demonstrates:
 * 1. Catch-all wildcard route: <Route path="*" element={<NotFound />} />
 * 2. useNavigate for returning home or back
 * 3. Inspecting the faulty location.pathname
 */
export const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">
          404
        </span>
        <h1 className="text-2xl font-bold text-white mt-2">Route Not Found</h1>
        <p className="text-sm text-slate-400 mt-2">
          The requested route does not exist in our route table:
        </p>

        <div className="my-4 p-2.5 bg-slate-900 border border-slate-700 rounded-lg font-mono text-rose-400 text-xs break-all">
          {location.pathname}
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Handled by React Router wildcard route: <code className="text-indigo-300">&lt;Route path="*" ... /&gt;</code>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition"
          >
            Go Back One Step
          </button>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/30 transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
