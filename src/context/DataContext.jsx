import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
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
  
  const mergedStates = useMemo(() => {
    const uniqueCustomStates = customStates.filter(
      customState => !STATES.some(state => state.id === customState.id)
    );

    return [...STATES, ...uniqueCustomStates];
  }, [customStates]);

  const mergedCities = useMemo(() => {
    const citiesByState = { ...CITIES };

    Object.keys(customCities).forEach(stateId => {
      const baseCities = citiesByState[stateId] || [];
      const customStateCities = customCities[stateId] || [];
      const dedupedCities = [...baseCities];
      const seenIds = new Set(baseCities.map(city => city.id));

      customStateCities.forEach(city => {
        if (!seenIds.has(city.id)) {
          dedupedCities.push(city);
          seenIds.add(city.id);
        }
      });

      citiesByState[stateId] = dedupedCities;
    });

    return citiesByState;
  }, [customCities]);

  const [selectedState, setSelectedState] = useLocalStorage('selectedState', STATES[0].id);
  
  // Initialize selectedCity with proper fallback logic
  const getInitialCity = () => {
    const stateCities = CITIES[STATES[0].id] || [];
    return stateCities.length > 0 ? stateCities[0].id : 'all';
  };
  
  const [selectedCity, setSelectedCity] = useLocalStorage('selectedCity', getInitialCity());
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
      
      // Handle case where state has no cities
      if (cities.length === 0) {
        setEnergyData(null);
        setFallbackMode(true);
        setLoading(false);
        return;
      }
      
      // Ensure selected city is valid for current state
      let cityToUse = cities.find(c => c.id === selectedCity);
      if (!cityToUse) {
        cityToUse = cities[0];
        setSelectedCity(cityToUse.id);
      }
      
      const data = await fetchEnergyData(cityToUse.lat, cityToUse.lon, timeframe);
      
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
  }, [selectedCity, selectedState, timeframe, mergedCities, setSelectedCity]);

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
    setEnergyData,
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
