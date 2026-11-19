import React, { useState } from 'react';

export const NotificationSettings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white">Notification Preferences</h3>
        <p className="text-xs text-slate-400 mt-1">Configure automated email, Slack, and in-app alerts</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg">
          Notification preferences saved!
        </div>
      )}

      <div className="space-y-3">
        {[
          {
            title: 'Critical System Alerts',
            desc: 'Immediate notifications on server load spikes or security events',
            checked: emailAlerts,
            toggle: () => setEmailAlerts(!emailAlerts)
          },
          {
            title: 'Inventory & Order Notifications',
            desc: 'Get notified when an item is low in stock or a high-value order arrives',
            checked: orderAlerts,
            toggle: () => setOrderAlerts(!orderAlerts)
          },
          {
            title: 'Weekly Performance Digest',
            desc: 'Summarized analytics email every Monday morning',
            checked: weeklyDigest,
            toggle: () => setWeeklyDigest(!weeklyDigest)
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/50"
          >
            <div>
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
            <button
              type="button"
              onClick={item.toggle}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-200 ${
                item.checked ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-700/60 flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
        >
          Save Preferences
        </button>
      </div>
    </form>
  );
};
