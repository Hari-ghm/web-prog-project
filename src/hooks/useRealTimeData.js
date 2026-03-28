import { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';

export const useRealTimeData = () => {
  const { 
    energyData, 
    setEnergyData, 
    addNotification, 
    silentRefresh,
    fallbackMode
  } = useData();
  
  const timerRef = useRef(null);

  useEffect(() => {
    // Start 10-second auto refresh interval
    timerRef.current = setInterval(() => {
      // If we are in fallback mode or data is available, slightly alter the data to simulate real-time
      if (energyData) {
        
        // Randomly decide if we show a notification (1 in 5 chance per tick)
        if (Math.random() > 0.8) {
          const isWind = Math.random() > 0.5;
          const increased = Math.random() > 0.5;
          
          if (isWind) {
            const windChange = (Math.random() * 5).toFixed(1);
            addNotification(
              `Wind levels ${increased ? 'increased' : 'decreased'} by ${windChange}%`, 
              increased ? 'success' : 'info'
            );
            
            // Mutate state with jitter
            setEnergyData(prev => {
              const newPower = increased ? prev.wind.power * 1.05 : prev.wind.power * 0.95;
              return {
                ...prev,
                wind: { ...prev.wind, power: Math.round(newPower) },
                total: Math.round(newPower + prev.solar.power)
              };
            });
          } else {
            addNotification("Solar output stable", "info");
          }
        }
        
        // Background silent refresh for actual API data
        // For simulation purposes we just rely on local jitter, but we could trigger silentRefresh() here every 5 mins
      }
    }, 10000); // 10 seconds

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [energyData, addNotification, setEnergyData, silentRefresh, fallbackMode]);
};
