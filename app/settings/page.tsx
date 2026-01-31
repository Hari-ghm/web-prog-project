'use client';
import { useState } from 'react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
          <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                   <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500" defaultValue="Admin User" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                   <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500" defaultValue="admin@energrid.com" />
                </div>
              </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            {['Email Alerts for Critical Failures', 'Weekly Efficiency Reports', 'New Device Detection', 'Maintenance Reminders'].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between">
                    <span className="text-slate-300">{setting}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            ))}
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
           <h2 className="text-xl font-semibold text-white mb-4">System Preferences</h2>
           <div className="space-y-4">
               <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Refresh Rate</label>
                   <select className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                       <option>Real-time (Auto)</option>
                       <option>Every 5 seconds</option>
                       <option>Every minute</option>
                   </select>
               </div>
               <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Data Retention</label>
                   <select className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                       <option>30 Days</option>
                       <option>90 Days</option>
                       <option>1 Year</option>
                   </select>
               </div>
           </div>
        </div>
        
        <div className="flex justify-end pt-4">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}
