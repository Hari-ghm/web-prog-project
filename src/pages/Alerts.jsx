import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useRealTimeData } from '../hooks/useRealTimeData';

const Alerts = () => {
  useRealTimeData();
  const { energyData, selectedState, selectedCity } = useData();
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Wind Power Drop',
      message: 'Wind energy output has decreased by 25% in the last hour',
      timestamp: new Date(Date.now() - 3600000),
      source: 'Wind Sensor Array A',
      acknowledged: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Solar Panel Maintenance Scheduled',
      message: 'Routine maintenance scheduled for Solar Array B on 2026-04-05',
      timestamp: new Date(Date.now() - 7200000),
      source: 'System',
      acknowledged: false
    }
  ]);

  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (!energyData) return;

    const checkAlerts = () => {
      const newAlerts = [];
      
      if (energyData.solar.power < 50) {
        const existingAlert = alerts.find(a => a.id === 100);
        if (!existingAlert) {
          newAlerts.push({
            id: 100,
            type: 'warning',
            title: 'Low Solar Output',
            message: `Solar power is at ${energyData.solar.power}MW (below threshold of 50MW)`,
            timestamp: new Date(),
            source: 'Solar Sensor Network',
            acknowledged: false
          });
        }
      }

      if (energyData.wind.power < 40) {
        const existingAlert = alerts.find(a => a.id === 101);
        if (!existingAlert) {
          newAlerts.push({
            id: 101,
            type: 'warning',
            title: 'Low Wind Output',
            message: `Wind power is at ${energyData.wind.power}MW (below threshold of 40MW)`,
            timestamp: new Date(),
            source: 'Wind Sensor Array',
            acknowledged: false
          });
        }
      }

      if (energyData.total > 300) {
        const existingAlert = alerts.find(a => a.id === 102);
        if (!existingAlert) {
          newAlerts.push({
            id: 102,
            type: 'success',
            title: 'High Generation Peak',
            message: `Total generation reached ${energyData.total}MW - exceeding expected capacity!`,
            timestamp: new Date(),
            source: 'Grid Monitor',
            acknowledged: false
          });
        }
      }

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 20));
      }
    };

    checkAlerts();
  }, [energyData, alerts]);

  const handleAcknowledge = (alertId) => {
    setAcknowledgedAlerts(prev => [...prev, alertId]);
    setAlerts(prev => prev.map(a => a.id === alertId ? {...a, acknowledged: true} : a));
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical':
        return '🔴';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '📢';
    }
  };

  const getAlertColor = (type) => {
    switch(type) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'info':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'success':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filterType);

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="animate-fade-in pb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">System Alerts & Notifications</h1>
          <p className="text-sm text-textSecondary dark:text-gray-400">
            {unacknowledgedCount} unacknowledged alert{unacknowledgedCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setAlerts(prev => prev.map(a => ({...a, acknowledged: true})))}
            className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition"
          >
            Acknowledge All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card-base p-4 border-l-4 border-l-teal">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-textSecondary dark:text-gray-400">Solar Generation</p>
              <p className="text-2xl font-bold">{energyData?.solar?.power || 0}MW</p>
            </div>
            <span className="text-3xl">☀️</span>
          </div>
        </div>
        <div className="card-base p-4 border-l-4 border-l-blue">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-textSecondary dark:text-gray-400">Wind Generation</p>
              <p className="text-2xl font-bold">{energyData?.wind?.power || 0}MW</p>
            </div>
            <span className="text-3xl">💨</span>
          </div>
        </div>
        <div className="card-base p-4 border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-textSecondary dark:text-gray-400">Total Output</p>
              <p className="text-2xl font-bold">{energyData?.total || 0}MW</p>
            </div>
            <span className="text-3xl">⚡</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'critical', 'warning', 'info', 'success'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterType === type
                ? 'bg-teal text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-textSecondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`card-base p-6 border-l-4 transition ${
                getAlertColor(alert.type)
              } ${alert.acknowledged ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="text-2xl mt-1">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{alert.title}</h3>
                      {alert.acknowledged && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Acknowledged</span>
                      )}
                    </div>
                    <p className="text-sm text-textSecondary dark:text-gray-300 mb-2">{alert.message}</p>
                    <div className="flex gap-4 text-xs text-textSecondary dark:text-gray-400">
                      <span>📍 {alert.source}</span>
                      <span>🕐 {alert.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="ml-4 px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition whitespace-nowrap"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card-base p-12 text-center">
            <p className="text-lg text-textSecondary dark:text-gray-400">✨ No alerts in this category</p>
            <p className="text-sm text-textSecondary dark:text-gray-400 mt-2">All systems operating normally</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
