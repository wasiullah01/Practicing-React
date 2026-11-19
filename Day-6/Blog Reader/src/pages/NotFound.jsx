import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="text-center py-24 max-w-md mx-auto space-y-4">
      <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
        404
      </span>
      <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
      <p className="text-sm text-slate-400">
        The route you requested could not be located in the blog index:
      </p>

      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-emerald-400 text-xs break-all">
        {location.pathname}
      </div>

      <div className="pt-4 flex justify-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/25 transition"
        >
          Return to Feed
        </Link>
      </div>
    </div>
  );
};
