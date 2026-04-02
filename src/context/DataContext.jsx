import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { STATES, CITIES } from '../utils/constants';
import { fetchEnergyData } from '../services/dataService';
import { api } from '../services/backendApi';
import { useAuth } from './AuthContext';

export const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

export const DataProvider = ({ children }) => {
  const { user, updateUserPreferences } = useAuth();
  const [customStates, setCustomStates] = useState([]);
  const [customCities, setCustomCities] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);

  const [selectedState, setSelectedState] = useState(STATES[0].id);
  const [selectedCity, setSelectedCity] = useState((CITIES[STATES[0].id] || [])[0]?.id || 'all');
  const [timeframe, setTimeframe] = useState('Daily');

  const [energyData, setEnergyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [settingsLoading, setSettingsLoading] = useState(true);

  const hydratedPreferencesRef = useRef(false);

  const mergedStates = useMemo(() => {
    const uniqueCustomStates = customStates.filter(
      (customState) => !STATES.some((state) => state.id === customState.id)
    );

    return [...STATES, ...uniqueCustomStates];
  }, [customStates]);

  const mergedCities = useMemo(() => {
    const citiesByState = { ...CITIES };

    Object.keys(customCities).forEach((stateId) => {
      const baseCities = citiesByState[stateId] || [];
      const customStateCities = customCities[stateId] || [];
      const dedupedCities = [...baseCities];
      const seenIds = new Set(baseCities.map((city) => city.id));

      customStateCities.forEach((city) => {
        if (!seenIds.has(city.id)) {
          dedupedCities.push(city);
          seenIds.add(city.id);
        }
      });

      citiesByState[stateId] = dedupedCities;
    });

    return citiesByState;
  }, [customCities]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setNotifications((prev) => [{ id, message, type, time: new Date() }, ...prev].slice(0, 10));

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const loadAdminConfig = useCallback(async () => {
    if (!user) {
      setCustomStates([]);
      setCustomCities({});
      setAuditLogs([]);
      return { customStates: [], customCities: {}, auditLogs: [] };
    }

    const response = await api.getAdminConfig();
    setCustomStates(response.customStates || []);
    setCustomCities(response.customCities || {});
    setAuditLogs(response.auditLogs || []);
    return response;
  }, [user]);

  const loadUserPreferences = useCallback(async (dbCustomCities = {}) => {
    if (!user) {
      hydratedPreferencesRef.current = false;
      setSettingsLoading(false);
      return;
    }

    const response = await api.getPreferences();
    const preferences = response.preferences || {};
    const availableCities = { ...CITIES, ...dbCustomCities };

    const preferredState = preferences.selectedState;
    const defaultState = STATES[0]?.id;
    const stateToUse =
      preferredState && Array.isArray(availableCities[preferredState]) && availableCities[preferredState].length > 0
        ? preferredState
        : defaultState;

    const stateCities = availableCities[stateToUse] || [];
    const preferredCity = preferences.selectedCity;
    const cityToUse =
      preferredCity && stateCities.some((c) => c.id === preferredCity)
        ? preferredCity
        : (stateCities[0]?.id || 'all');

    setSelectedState(stateToUse);
    setSelectedCity(cityToUse);
    if (preferences.timeframe) setTimeframe(preferences.timeframe);

    hydratedPreferencesRef.current = true;
    setSettingsLoading(false);
  }, [user]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setSettingsLoading(true);
        const adminConfig = await loadAdminConfig();
        await loadUserPreferences(adminConfig?.customCities || {});
      } catch {
        setSettingsLoading(false);
      }
    };

    bootstrap();
  }, [loadAdminConfig, loadUserPreferences]);

  const loadData = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      try {
        const cities = mergedCities[selectedState] || [];

        if (cities.length === 0) {
          setEnergyData(null);
          setFallbackMode(true);
          setLoading(false);
          return;
        }

        let cityToUse = cities.find((c) => c.id === selectedCity);
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
        console.error('Failed to load data', err);
        setError('Failed to fetch latest data');
        setFallbackMode(true);
      } finally {
        if (!isSilent) setLoading(false);
      }
    },
    [selectedCity, selectedState, timeframe, mergedCities]
  );

  useEffect(() => {
    if (settingsLoading) return;
    loadData();
  }, [selectedCity, selectedState, timeframe, loadData, settingsLoading]);

  useEffect(() => {
    if (!user || !hydratedPreferencesRef.current) return;

    const timeout = setTimeout(async () => {
      try {
        await api.savePreferences({ selectedState, selectedCity, timeframe });
        updateUserPreferences({ selectedState, selectedCity, timeframe });
      } catch {
        // Non-blocking persistence.
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [selectedState, selectedCity, timeframe, user, updateUserPreferences]);

  const addCustomState = useCallback(
    async (statePayload) => {
      await api.addState(statePayload);
      await loadAdminConfig();
    },
    [loadAdminConfig]
  );

  const addCustomCity = useCallback(
    async (cityPayload) => {
      await api.addCity(cityPayload);
      await loadAdminConfig();
    },
    [loadAdminConfig]
  );

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
    addCustomState,
    addCustomCity,
    auditLogs,
    reloadAdminConfig: loadAdminConfig
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
