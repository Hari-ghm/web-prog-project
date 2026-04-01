import { useEffect, useRef, useCallback } from 'react';
import { useData } from '../context/DataContext';

export const useRealTimeData = () => {
  const { 
    energyData, 
    setEnergyData, 
    addNotification, 
    silentRefresh
  } = useData();
  
  const timerRef = useRef(null);
  const refreshTimerRef = useRef(null);
  const initializedRef = useRef(false);

  // Memoize the notification callback to avoid stale closures
  const handleRandomUpdate = useCallback(() => {
    if (Math.random() > 0.8) {
      const isWind = Math.random() > 0.5;
      const increased = Math.random() > 0.5;

      if (isWind) {
        const windChange = (Math.random() * 5).toFixed(1);
        addNotification(
          `Wind levels ${increased ? 'increased' : 'decreased'} by ${windChange}%`, 
          increased ? 'success' : 'info'
        );

        // Update state immutably
        setEnergyData(prev => {
          if (!prev || !prev.wind) return prev;
          const newPower = increased ? prev.wind.power * 1.05 : prev.wind.power * 0.95;
          return {
            ...prev,
            wind: { ...prev.wind, power: Math.round(newPower) },
            total: Math.round(newPower + (prev.solar?.power || 0))
          };
        });
      }
    }
  }, [addNotification, setEnergyData]);

  // Set up timers only once when energyData is first available
  useEffect(() => {
    if (!energyData || initializedRef.current) return;
    initializedRef.current = true;

    // Start 10-second real-time jitter simulation interval
    timerRef.current = setInterval(() => {
      handleRandomUpdate();
    }, 10000);

    // Silent refresh every 5 minutes for actual API data
    refreshTimerRef.current = setInterval(() => {
      silentRefresh();
    }, 5 * 60 * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [energyData, handleRandomUpdate, silentRefresh]);
};
