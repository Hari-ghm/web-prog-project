import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STATES, CITIES } from '../utils/constants';
import { fetchEnergyData } from '../services/dataService';

export const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

export const DataProvider = ({ children }) => {
  const [customStates, setCustomStates] = useLocalStorage('customStates', []);
  const [customCities, setCustomCities] = useLocalStorage('customCities', {});
  
  const mergedStates = [...STATES, ...customStates];
  const mergedCities = { ...CITIES };
  Object.keys(customCities).forEach(stateId => {
    if (mergedCities[stateId]) {
      mergedCities[stateId] = [...mergedCities[stateId], ...customCities[stateId]];
    } else {
      mergedCities[stateId] = customCities[stateId];
    }
  });

  const [selectedState, setSelectedState] = useLocalStorage('selectedState', STATES[0].id);
  // Ensure we fallback properly if city is missing
  const [selectedCity, setSelectedCity] = useLocalStorage('selectedCity', CITIES['tamil-nadu'][0].id);
  const [timeframe, setTimeframe] = useState('Daily');
  const [energyData, setEnergyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [{ id, message, type, time: new Date() }, ...prev].slice(0, 10));
    
    // Auto remove after 5s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const cities = mergedCities[selectedState] || [];
      const cityData = cities.find(c => c.id === selectedCity) || cities[0];
      
      if (!cityData) {
        setEnergyData(null);
        setFallbackMode(true);
        setLoading(false);
        return;
      }
      
      const data = await fetchEnergyData(cityData.lat, cityData.lon, timeframe);
      
      setEnergyData(data);
      setFallbackMode(data.isMock);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Failed to load data", err);
      setError("Failed to fetch latest data");
      setFallbackMode(true);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [selectedCity]);

  // Initial load and dependency change load
  useEffect(() => {
    loadData();
  }, [selectedCity, selectedState, timeframe, loadData]);

  const value = {
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    timeframe,
    setTimeframe,
    energyData,
    loading,
    error,
    fallbackMode,
    notifications,
    addNotification,
    lastUpdated,
    refreshData: () => loadData(false),
    silentRefresh: () => loadData(true),
    setEnergyData, // for real-time hook to update
    mergedStates,
    mergedCities,
    setCustomStates,
    setCustomCities
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
