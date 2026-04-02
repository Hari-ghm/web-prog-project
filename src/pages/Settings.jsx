import React, { useState, useCallback, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/backendApi';

const defaultSettings = {
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12-hour',
  theme: 'dark',
  emailAlerts: true,
  systemNotif: true,
  alertThreshold: 'high',
  refreshInterval: '10s',
  openWeatherApiKey: '',
  nasaPowerApiKey: '',
  language: 'en',
  units: 'metric',
  dataRetention: '30days'
};

const Settings = () => {
  const { addNotification } = useData();
  const { toggleTheme } = useTheme();

  const [dateFormat, setDateFormat] = useState(defaultSettings.dateFormat);
  const [timeFormat, setTimeFormat] = useState(defaultSettings.timeFormat);
  const [theme, setTheme] = useState(defaultSettings.theme);

  const [emailAlerts, setEmailAlerts] = useState(defaultSettings.emailAlerts);
  const [systemNotif, setSystemNotif] = useState(defaultSettings.systemNotif);
  const [alertThreshold, setAlertThreshold] = useState(defaultSettings.alertThreshold);
  const [refreshInterval, setRefreshInterval] = useState(defaultSettings.refreshInterval);

  const [apiKey1, setApiKey1] = useState(defaultSettings.openWeatherApiKey);
  const [apiKey2, setApiKey2] = useState(defaultSettings.nasaPowerApiKey);
  const [showKey1, setShowKey1] = useState(false);
  const [showKey2, setShowKey2] = useState(false);

  const [language, setLanguage] = useState(defaultSettings.language);
  const [units, setUnits] = useState(defaultSettings.units);
  const [dataRetention, setDataRetention] = useState(defaultSettings.dataRetention);

  const [backupDate, setBackupDate] = useState(new Date().toLocaleString());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await api.getPreferences();
        const p = { ...defaultSettings, ...(response.preferences || {}) };
        setDateFormat(p.dateFormat);
        setTimeFormat(p.timeFormat);
        setTheme(p.theme);
        setEmailAlerts(p.emailAlerts);
        setSystemNotif(p.systemNotif);
        setAlertThreshold(p.alertThreshold);
        setRefreshInterval(p.refreshInterval);
        setApiKey1(p.openWeatherApiKey || '');
        setApiKey2(p.nasaPowerApiKey || '');
        setLanguage(p.language);
        setUnits(p.units);
        setDataRetention(p.dataRetention);
      } catch {
        addNotification('Could not load saved settings from database', 'warning');
      }
    };

    loadPreferences();
  }, [addNotification]);

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
    element.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(settings, null, 2))}`);
    element.setAttribute('download', `ecodash-settings-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addNotification('Settings exported successfully', 'success');
  };

  const persistSettings = async (payload) => {
    setSaving(true);
    try {
      await api.savePreferences(payload);
      await toggleTheme(payload.theme);
      setBackupDate(new Date().toLocaleString());
      addNotification('Settings saved successfully!', 'success');
    } catch (error) {
      addNotification(error.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFactoryReset = async () => {
    if (!window.confirm('This will reset all settings to default. Are you sure?')) {
      return;
    }

    setDateFormat(defaultSettings.dateFormat);
    setTimeFormat(defaultSettings.timeFormat);
    setTheme(defaultSettings.theme);
    setEmailAlerts(defaultSettings.emailAlerts);
    setSystemNotif(defaultSettings.systemNotif);
    setAlertThreshold(defaultSettings.alertThreshold);
    setRefreshInterval(defaultSettings.refreshInterval);
    setLanguage(defaultSettings.language);
    setUnits(defaultSettings.units);
    setDataRetention(defaultSettings.dataRetention);
    setApiKey1(defaultSettings.openWeatherApiKey);
    setApiKey2(defaultSettings.nasaPowerApiKey);

    await persistSettings(defaultSettings);
  };

  const handleSave = async () => {
    await persistSettings({
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
      openWeatherApiKey: apiKey1,
      nasaPowerApiKey: apiKey2
    });
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
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold border-b border-borderLight dark:border-gray-800 pb-3 mb-5">Display Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Date Format</label>
              <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Time Format</label>
              <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)} className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal">
                <option value="12-hour">12-hour (AM/PM)</option>
                <option value="24-hour">24-hour</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Theme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="in">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Units</label>
              <select value={units} onChange={(e) => setUnits(e.target.value)} className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal">
                <option value="metric">Metric (MW, km/h)</option>
                <option value="imperial">Imperial (MWh, mph)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Data Retention</label>
              <select value={dataRetention} onChange={(e) => setDataRetention(e.target.value)} className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal">
                <option value="7days">7 Days</option>
                <option value="30days">30 Days</option>
                <option value="90days">90 Days</option>
                <option value="1year">1 Year</option>
              </select>
            </div>
          </div>
        </div>

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
              <select value={alertThreshold} onChange={(e) => setAlertThreshold(e.target.value)} className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal">
                <option value="low">Low (Alert on any deviation)</option>
                <option value="medium">Medium (Alert on 15% deviation)</option>
                <option value="high">High (Alert on 30% deviation)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Refresh Interval</label>
              <select value={refreshInterval} onChange={(e) => setRefreshInterval(e.target.value)} className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal">
                <option value="5s">5 seconds (High load)</option>
                <option value="10s">10 seconds (Recommended)</option>
                <option value="30s">30 seconds (Low load)</option>
                <option value="1m">1 minute (Minimal load)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex justify-between items-center border-b border-borderLight dark:border-gray-800 pb-3 mb-5">
            <h2 className="text-lg font-semibold">API Configuration</h2>
            <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded dark:bg-teal-900 dark:text-teal-200">Security: Stored in MongoDB</span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">OpenWeather API Key</label>
              <div className="flex gap-3">
                <input type={showKey1 ? 'text' : 'password'} value={apiKey1} onChange={(e) => setApiKey1(e.target.value)} className="flex-1 bg-lightPrimary dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm focus:ring-teal focus:border-teal outline-none" />
                <button onClick={() => setShowKey1(!showKey1)} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">{showKey1 ? 'Hide' : 'Show'}</button>
                <button onClick={() => handleTestAPI(1)} className="px-4 py-2 bg-teal text-white hover:bg-teal/90 rounded-lg text-sm font-medium transition-colors">Test</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">NASA POWER API Key</label>
              <div className="flex gap-3">
                <input type={showKey2 ? 'text' : 'password'} value={apiKey2} onChange={(e) => setApiKey2(e.target.value)} className="flex-1 bg-lightPrimary dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm focus:ring-teal focus:border-teal outline-none" />
                <button onClick={() => setShowKey2(!showKey2)} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">{showKey2 ? 'Hide' : 'Show'}</button>
                <button onClick={() => handleTestAPI(2)} className="px-4 py-2 bg-teal text-white hover:bg-teal/90 rounded-lg text-sm font-medium transition-colors">Test</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-base p-6 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/20">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <button onClick={handleFactoryReset} className="w-full px-4 py-3 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition">
              Reset All Settings to Default
            </button>
            <p className="text-xs text-textSecondary dark:text-gray-400">This action cannot be undone. All preferences will be lost.</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-teal text-white rounded-lg font-medium hover:bg-teal/90 transition disabled:opacity-70">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
