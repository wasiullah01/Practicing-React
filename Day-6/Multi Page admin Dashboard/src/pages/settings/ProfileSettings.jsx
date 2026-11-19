import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const ProfileSettings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Admin User');
  const [email, setEmail] = useState(user?.email || 'admin@nexus.dev');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
        />
        <div>
          <h3 className="text-base font-semibold text-white">{name}</h3>
          <p className="text-xs text-slate-400">Update your photo and personal profile details</p>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg">
          Profile changes saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700/60 flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
};
