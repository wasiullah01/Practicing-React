import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockUsers } from '../data/mockData';
import { ArrowLeft, UserCircle, CheckCircle, Shield } from '../components/Icons';

/**
 * UserDetail demonstrates:
 * 1. useParams hook for reading dynamic URL parameters (:id)
 * 2. useNavigate for programmatic back navigation
 * 3. Handling not found IDs gracefully within detail routes
 */
export const UserDetail = () => {
  // Extract dynamic segment :id from route "/users/:id"
  const { id } = useParams();
  const navigate = useNavigate();

  // Find user by ID
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return (
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 text-center max-w-lg mx-auto mt-10">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
          <UserCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">User Not Found</h2>
        <p className="text-sm text-slate-400 mt-2">
          No profile found matching dynamic ID: <code className="text-rose-300 font-mono">{id}</code>
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => navigate('/users')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition"
          >
            Back to Users Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button using useNavigate(-1) */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-3.5 py-2 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </button>

        <span className="text-xs text-slate-400">
          Profile ID: <code className="text-indigo-300 font-mono">{id}</code>
        </span>
      </div>

      {/* Profile Card */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        {/* Cover header */}
        <div className="h-32 bg-gradient-to-r from-indigo-700 to-purple-800 relative">
          <div className="absolute right-4 top-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                user.status === 'Active'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
              }`}
            >
              Status: {user.status}
            </span>
          </div>
        </div>

        {/* Info header */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 gap-4 pb-6 border-b border-slate-700/60">
            <div className="flex items-end gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-800 shadow-xl"
              />
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-sm text-indigo-400 font-medium">{user.role} &bull; {user.department}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => alert(`Simulated edit for ${user.name}`)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Biography & Background
                </h3>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-700/40">
                  {user.bio}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Contact Coordinates
                </h3>
                <div className="mt-2 space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-700/40">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white font-mono">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/40">
                    <span className="text-slate-400">Phone:</span>
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Member Since:</span>
                    <span>{user.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Routing Parameters Details
                </h3>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 font-mono text-xs space-y-2 text-indigo-300">
                  <p><span className="text-slate-400">Path pattern:</span> /users/:id</p>
                  <p><span className="text-slate-400">Actual URL:</span> /users/{id}</p>
                  <p><span className="text-slate-400">Hook used:</span> useParams()</p>
                  <p><span className="text-slate-400">Rendered with:</span> Dynamic Mock Lookup</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quick Navigation Test
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mockUsers.filter((u) => u.id !== id).slice(0, 3).map((peer) => (
                    <Link
                      key={peer.id}
                      to={`/users/${peer.id}`}
                      className="px-2.5 py-1 text-xs bg-slate-700/60 hover:bg-indigo-600/60 text-slate-200 rounded transition"
                    >
                      View {peer.name.split(' ')[0]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
