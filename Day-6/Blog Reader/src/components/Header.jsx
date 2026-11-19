import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search } from './Icons';
import { categories } from '../data/blogData';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Home Link */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight group-hover:text-emerald-400 transition">
              DevChronicles
            </span>
            <span className="block text-[10px] text-slate-400 font-medium -mt-1">
              Curated Web Engineering
            </span>
          </div>
        </Link>

        {/* Desktop Nav using <NavLink> with active styling */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            Feed
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            Categories
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            About
          </NavLink>

          {/* Quick Query Filter button */}
          <button
            onClick={() => navigate('/?tag=React')}
            className="hidden md:inline-flex items-center gap-1.5 ml-3 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-900 border border-slate-700/80 text-emerald-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Filter #React</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
