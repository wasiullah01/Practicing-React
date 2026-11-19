import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Bell, Search, UserCircle, LogOut } from './Icons';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <header className="h-16 border-b border-slate-700/60 bg-slate-800/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <nav className="flex items-center space-x-2 text-sm">
        <Link to="/dashboard" className="text-slate-400 hover:text-white transition">
          Home
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const formatted = value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <React.Fragment key={to}>
              <span className="text-slate-600">/</span>
              {isLast ? (
                <span className="text-indigo-400 font-semibold">{formatted}</span>
              ) : (
                <Link to={to} className="text-slate-400 hover:text-white transition">
                  {formatted}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/users?status=Active')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition"
        >
          <span>Active Users</span>
        </button>

        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
        </button>

        <Link
          to="/settings/profile"
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white pl-2 border-l border-slate-700/60 transition"
        >
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt="User profile"
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="hidden sm:inline font-medium">{user?.name}</span>
        </Link>
      </div>
    </header>
  );
};
