import React from 'react';
import StatsCard from './StatsCard';
import { useData } from '../../context/DataContext';

const OverviewCards = () => {
  const { energyData } = useData();
  
  if (!energyData) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard 
        title="Total Energy Generated"
        value={energyData.total}
        trend="+12.5"
        subtext="Last 24 hours"
      />
      <StatsCard 
        title="Solar Output"
        value={energyData.solar.power}
        trend={energyData.solar.trend}
        subtext={`Solar Irradiance: ${energyData.solar.irradiance} kWh/m²`}
        type="solar"
      />
      <StatsCard 
        title="Wind Output"
        value={energyData.wind.power}
        trend={energyData.wind.trend}
        subtext={`Wind Speed: ${energyData.wind.speed} km/h`}
        type="wind"
      />
    </div>
  );
};

export default OverviewCards;
