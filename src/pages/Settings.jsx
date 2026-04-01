import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';

const Settings = () => {
  const { addNotification } = useData();
  
  // Display settings
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [theme, setTheme] = useState('dark');
  
  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [systemNotif, setSystemNotif] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState('high');
  const [refreshInterval, setRefreshInterval] = useState('10s');
  
  // API Keys
  const [apiKey1, setApiKey1] = useState('lMlr4IEfZ3ah4MoDNy9vHytQRa3fQVlIouvwyXTw');
  const [apiKey2, setApiKey2] = useState('6371d804d7c55a9f6879e3fca8acf354');
  const [showKey1, setShowKey1] = useState(false);
  const [showKey2, setShowKey2] = useState(false);
  
  // User preferences
  const [language, setLanguage] = useState('en');
  const [units, setUnits] = useState('metric');
  const [dataRetention, setDataRetention] = useState('30days');
  
  // Export data
  const [backupDate, setBackupDate] = useState(new Date().toLocaleString());

  const handleTestAPI = useCallback((apiNum) => {
    addNotification(`API Key ${apiNum} connection test initiated...`, 'info');
    setTimeout(() => {
      addNotification(`API Key ${apiNum} connection successful!`, 'success');
    }, 1500);
  }, [addNotification]);

  const handleExportSettings = () => {
    const settings = {
      dateFormat,
      timeFormat,
      theme,
      emailAlerts,
      systemNotif,
      alertThreshold,
      refreshInterval,
      language,
      units,
      dataRetention,
      exportedAt: new Date().toISOString()
    };
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2)));
    element.setAttribute('download', `ecodash-settings-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addNotification('Settings exported successfully', 'success');
  };

  const handleFactoryReset = () => {
    if (window.confirm('This will reset all settings to default. Are you sure?')) {
      setDateFormat('DD/MM/YYYY');
      setTimeFormat('12-hour');
      setTheme('dark');
      setEmailAlerts(true);
      setSystemNotif(true);
      setAlertThreshold('high');
      setRefreshInterval('10s');
      setLanguage('en');
      setUnits('metric');
      setDataRetention('30days');
      addNotification('Settings reset to default', 'success');
    }
  };

  return (
    <div className="animate-fade-in pb-8 max-w-5xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">System Settings</h1>
          <p className="text-sm text-textSecondary dark:text-gray-400">Last backup: {backupDate}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportSettings}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Export Settings
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Display Settings */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold border-b border-borderLight dark:border-gray-800 pb-3 mb-5">Display Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Date Format</label>
              <select 
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal"
              >
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Time Format</label>
              <select 
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="12-hour">12-hour (AM/PM)</option>
                <option value="24-hour">24-hour</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Theme</label>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="in">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Units</label>
              <select 
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="metric">Metric (MW, km/h)</option>
                <option value="imperial">Imperial (MWh, mph)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Data Retention</label>
              <select 
                value={dataRetention}
                onChange={(e) => setDataRetention(e.target.value)}
                className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="7days">7 Days</option>
                <option value="30days">30 Days</option>
                <option value="90days">90 Days</option>
                <option value="1year">1 Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold border-b border-borderLight dark:border-gray-800 pb-3 mb-5">Alerts & Notifications</h2>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 border border-borderLight dark:border-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-sm">Email Alerts</p>
                <p className="text-xs text-textSecondary dark:text-gray-500">Receive email notifications for critical events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="sr-only peer" />
                <div className={`w-11 h-6 rounded-full peer transition ${emailAlerts ? 'bg-teal' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-all ${emailAlerts ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-borderLight dark:border-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-sm">System Notifications</p>
                <p className="text-xs text-textSecondary dark:text-gray-500">In-app notifications for system status</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={systemNotif} onChange={(e) => setSystemNotif(e.target.checked)} className="sr-only peer" />
                <div className={`w-11 h-6 rounded-full peer transition ${systemNotif ? 'bg-teal' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-all ${systemNotif ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Alert Sensitivity Threshold</label>
              <select 
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="low">Low (Alert on any deviation)</option>
                <option value="medium">Medium (Alert on 15% deviation)</option>
                <option value="high">High (Alert on 30% deviation)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Refresh Interval</label>
              <select 
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="5s">5 seconds (High load)</option>
                <option value="10s">10 seconds (Recommended)</option>
                <option value="30s">30 seconds (Low load)</option>
                <option value="1m">1 minute (Minimal load)</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="card-base p-6">
          <div className="flex justify-between items-center border-b border-borderLight dark:border-gray-800 pb-3 mb-5">
            <h2 className="text-lg font-semibold">API Configuration</h2>
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded dark:bg-amber-900 dark:text-amber-200">Security: Stored Locally</span>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">OpenWeather API Key</label>
              <div className="flex gap-3">
                <input 
                  type={showKey1 ? "text" : "password"}
                  value={apiKey1}
                  onChange={(e) => setApiKey1(e.target.value)}
                  className="flex-1 bg-lightPrimary dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm focus:ring-teal focus:border-teal outline-none"
                />
                <button 
                  onClick={() => setShowKey1(!showKey1)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {showKey1 ? 'Hide' : 'Show'}
                </button>
                <button 
                  onClick={() => handleTestAPI(1)}
                  className="px-4 py-2 bg-teal text-white hover:bg-teal/90 rounded-lg text-sm font-medium transition-colors"
                >
                  Test
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">NASA POWER API Key</label>
              <div className="flex gap-3">
                <input 
                  type={showKey2 ? "text" : "password"}
                  value={apiKey2}
                  onChange={(e) => setApiKey2(e.target.value)}
                  className="flex-1 bg-lightPrimary dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm focus:ring-teal focus:border-teal outline-none"
                />
                <button 
                  onClick={() => setShowKey2(!showKey2)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {showKey2 ? 'Hide' : 'Show'}
                </button>
                <button 
                  onClick={() => handleTestAPI(2)}
                  className="px-4 py-2 bg-teal text-white hover:bg-teal/90 rounded-lg text-sm font-medium transition-colors"
                >
                  Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card-base p-6 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/20">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <button 
              onClick={handleFactoryReset}
              className="w-full px-4 py-3 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition"
            >
              🔄 Reset All Settings to Default
            </button>
            <p className="text-xs text-textSecondary dark:text-gray-400">This action cannot be undone. All preferences will be lost.</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => addNotification('Settings saved successfully!', 'success')}
            className="px-6 py-3 bg-teal text-white rounded-lg font-medium hover:bg-teal/90 transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
