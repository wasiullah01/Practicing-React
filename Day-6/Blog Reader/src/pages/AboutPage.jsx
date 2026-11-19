import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from '../components/Icons';

export const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/20">
          <BookOpen className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">About DevChronicles</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          An interactive blog reader application built to reinforce modern React Router concepts and clean component architecture.
        </p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
          Concepts & Objectives Applied
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
            <h3 className="font-bold text-emerald-400 text-sm">BrowserRouter & Routes</h3>
            <p className="text-slate-400">
              Root level router wrapper supporting instant, flicker-free client-side navigation.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
            <h3 className="font-bold text-emerald-400 text-sm">Nested &lt;Outlet /&gt;</h3>
            <p className="text-slate-400">
              The <code>BlogLayout</code> component renders persistent Header and Footer while swapping page views.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
            <h3 className="font-bold text-emerald-400 text-sm">Dynamic useParams</h3>
            <p className="text-slate-400">
              Extracts <code>:slug</code> and <code>:categorySlug</code> from URLs to fetch articles on the fly.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
            <h3 className="font-bold text-emerald-400 text-sm">useSearchParams (URL Filters)</h3>
            <p className="text-slate-400">
              Search query, tags, and category choices are reflected directly in <code>?q=...&category=...</code>.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/25 transition"
          >
            Start Reading Posts &rarr;
          </button>
          <button
            onClick={() => navigate('/categories')}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            Browse Categories
          </button>
        </div>
      </div>
    </div>
  );
};
