import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockDashboardStats, mockUsers, mockProducts } from '../data/mockData';
import { Users, Package, ArrowLeft, ChevronRight } from '../components/Icons';

export const DashboardOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-800 to-slate-800/80 border border-indigo-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            System Operational
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
            Welcome back to Nexus Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Monitor real-time system performance, user directories, inventory updates, and manage organization preferences in one centralized control hub.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/users')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-indigo-600/30"
            >
              Manage Users &rarr;
            </button>
            <button
              onClick={() => navigate('/settings/security')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition"
            >
              Security Settings
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Active Users</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{mockDashboardStats.totalUsers}</span>
            <span className="text-xs font-semibold text-emerald-400">{mockDashboardStats.growthRate}</span>
          </div>
          <Link to="/users" className="text-xs text-indigo-400 hover:underline mt-2 inline-block">
            View all users &rarr;
          </Link>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Products Catalog</span>
            <Package className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{mockProducts.length} items</span>
            <span className="text-xs font-semibold text-indigo-400">5 Categories</span>
          </div>
          <Link to="/products" className="text-xs text-indigo-400 hover:underline mt-2 inline-block">
            Manage inventory &rarr;
          </Link>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Revenue</span>
            <span className="text-emerald-400 font-bold">$</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{mockDashboardStats.revenue}</span>
            <span className="text-xs font-semibold text-emerald-400">+8.2%</span>
          </div>
          <span className="text-xs text-slate-400 mt-2 block">Calculated from completed orders</span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Deployments</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{mockDashboardStats.activeProjects}</span>
            <span className="text-xs text-slate-400">All healthy</span>
          </div>
          <Link to="/settings" className="text-xs text-indigo-400 hover:underline mt-2 inline-block">
            System preferences &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Preview Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base">Key Team Members</h2>
            <Link to="/users" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View All ({mockUsers.length})
            </Link>
          </div>
          <div className="divide-y divide-slate-700/50">
            {mockUsers.slice(0, 4).map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <Link
                      to={`/users/${u.id}`}
                      className="text-sm font-semibold text-white hover:text-indigo-400 transition"
                    >
                      {u.name}
                    </Link>
                    <p className="text-xs text-slate-400">{u.role} &bull; {u.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/users/${u.id}`)}
                  className="p-1 text-slate-400 hover:text-white"
                  title="View Profile Details"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base">Catalog Highlights</h2>
            <Link to="/products" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View All Products
            </Link>
          </div>
          <div className="divide-y divide-slate-700/50">
            {mockProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <Link
                      to={`/products/${p.id}`}
                      className="text-sm font-semibold text-white hover:text-indigo-400 transition"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-slate-400">${p.price} &bull; {p.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
                >
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
