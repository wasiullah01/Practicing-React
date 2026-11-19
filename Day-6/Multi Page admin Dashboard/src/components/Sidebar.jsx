import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Package, Settings, LogOut, Shield } from './Icons';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Users List', to: '/users', icon: Users },
    { name: 'Products Catalog', to: '/products', icon: Package },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-800/90 border-r border-slate-700/60 flex flex-col justify-between backdrop-blur-md min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-wide">Nexus Admin</h1>
            <span className="text-xs text-indigo-400 font-medium">Enterprise Suite</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-6">
          <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User profile card & Logout */}
      <div className="p-4 border-t border-slate-700/60">
        <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-900/40 border border-slate-700/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-slate-600"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.role || 'Super Admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
