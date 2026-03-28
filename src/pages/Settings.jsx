import React, { useState } from 'react';

const Settings = () => {
  const [apiKey1, setApiKey1] = useState('************************');
  const [apiKey2, setApiKey2] = useState('************************');

  return (
    <div className="animate-fade-in pb-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <div className="space-y-8">
        {/* Display Settings */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold border-b border-borderLight dark:border-gray-800 pb-3 mb-5">Display Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Date Format</label>
              <select className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Time Format</label>
              <select className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none">
                <option>12-hour (AM/PM)</option>
                <option>24-hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold border-b border-borderLight dark:border-gray-800 pb-3 mb-5">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Real-time Energy Alerts</p>
                <p className="text-xs text-textSecondary dark:text-gray-500">Get notified when generation fluctuates significantly</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">System Status Updates</p>
                <p className="text-xs text-textSecondary dark:text-gray-500">Connection errors or API fallback mode alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal"></div>
              </label>
            </div>
          </div>
        </div>

        {/* API Config */}
        <div className="card-base p-6">
          <div className="flex justify-between items-center border-b border-borderLight dark:border-gray-800 pb-3 mb-5">
            <h2 className="text-lg font-semibold">API Configuration</h2>
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded dark:bg-amber-900 dark:text-amber-200">Development View</span>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">OpenWeather API Key (Wind Data)</label>
              <div className="flex gap-3">
                <input 
                  type="password" 
                  value={apiKey1}
                  onChange={(e) => setApiKey1(e.target.value)}
                  className="flex-1 bg-lightPrimary dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm focus:ring-teal focus:border-teal outline-none"
                />
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors border border-transparent dark:border-gray-700">
                  Test
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">NASA POWER API Key (Solar Data)</label>
              <div className="flex gap-3">
                <input 
                  type="password" 
                  value={apiKey2}
                  onChange={(e) => setApiKey2(e.target.value)}
                  className="flex-1 bg-lightPrimary dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm focus:ring-teal focus:border-teal outline-none"
                />
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors border border-transparent dark:border-gray-700">
                  Test
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button className="px-6 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 rounded-lg text-sm font-medium bg-teal text-white hover:bg-teal/90 transition-colors">
                Save Keys
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold border-b border-borderLight dark:border-gray-800 pb-3 mb-5 text-red-600 dark:text-red-400">Danger Zone</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800/50 dark:hover:bg-red-900/40 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto text-left">
              Clear Local Cache
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto text-left">
              Export User Settings JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
