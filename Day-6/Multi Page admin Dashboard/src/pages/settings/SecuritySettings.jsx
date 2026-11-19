import React, { useState } from 'react';

export const SecuritySettings = () => {
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white">Security & Authentication</h3>
        <p className="text-xs text-slate-400 mt-1">Manage passwords, sessions, and multi-factor validation</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg">
          Security settings updated!
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <div>
            <p className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</p>
            <p className="text-xs text-slate-400">Require an authenticator code when logging into admin</p>
          </div>
          <button
            type="button"
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-200 ${
              twoFactor ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
          </button>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Auto Inactive Logout</p>
            <p className="text-xs text-slate-400">Automatically ends your session after idle time</p>
          </div>
          <select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
          >
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">1 Hour</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700/60 flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
        >
          Update Security Controls
        </button>
      </div>
    </form>
  );
};
