import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

/**
 * SettingsLayout demonstrates:
 * 1. Nested Route Tab Navigation
 * 2. Second-level <Outlet /> rendering child subroutes:
 *    - /settings/profile
 *    - /settings/security
 *    - /settings/notifications
 */
export const SettingsLayout = () => {
  const tabs = [
    { name: 'Profile Details', to: '/settings/profile' },
    { name: 'Security & Auth', to: '/settings/security' },
    { name: 'Notifications', to: '/settings/notifications' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-sm text-slate-400">
          Subroute tabs rendered using <code className="text-indigo-400">nested &lt;Route&gt;</code> and nested{' '}
          <code className="text-indigo-400">&lt;Outlet /&gt;</code>
        </p>
      </div>

      {/* Settings Sub-navigation Bar */}
      <div className="flex border-b border-slate-700/80 space-x-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `pb-3 px-4 text-sm font-semibold transition border-b-2 -mb-px ${
                isActive
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>

      {/* Render the Active Tab Content through <Outlet /> */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
        <Outlet />
      </div>
    </div>
  );
};
