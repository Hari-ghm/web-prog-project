import React, { useState, useCallback } from 'react';
import LineChart from '../components/Charts/LineChart';
import { useData } from '../context/DataContext';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { downloadCSV } from '../utils/exportUtils';

const Analytics = () => {
  const { energyData, lastUpdated } = useData();
  useRealTimeData(); // Enable real-time updates
  
  const [selectedMetric, setSelectedMetric] = useState('generation');

  // Calculate real-time metrics from actual data
  const calculateMetrics = useCallback(() => {
    if (!energyData || !energyData.chartData) {
      return {
        avgDaily: 'N/A',
        peakDay: 'N/A',
        weatherImpact: 'N/A'
      };
    }

    const chartData = energyData.chartData;
    const totalGeneration = chartData.reduce((sum, d) => sum + (d.solar || 0) + (d.wind || 0), 0);
    const avgDaily = Math.round(totalGeneration / chartData.length);
    
    const peakDay = chartData.reduce((max, d) => {
      const currentTotal = (d.solar || 0) + (d.wind || 0);
      return currentTotal > ((max.solar || 0) + (max.wind || 0)) ? d : max;
    }, chartData[0]);
    
    // Calculate weather impact based on solar vs wind ratio
    const totalSolar = chartData.reduce((sum, d) => sum + (d.solar || 0), 0);
    const totalWind = chartData.reduce((sum, d) => sum + (d.wind || 0), 0);
    const weatherImpact = totalSolar > totalWind ? '+wind assisted' : '+solar dependent';

    return {
      avgDaily: `${avgDaily} MWh`,
      peakDay: peakDay.time,
      weatherImpact
    };
  }, [energyData]);

  const metrics = [
    { label: 'Average Generation', value: calculateMetrics().avgDaily, trend: '+5.2%' },
    { label: 'Peak Generation Time', value: calculateMetrics().peakDay, trend: 'Highest' },
    { label: 'Weather Impact', value: calculateMetrics().weatherImpact, trend: 'Live' },
  ];

  return (
    <div className="animate-fade-in pb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Analytics Deep Dive</h1>
          <p className="text-sm text-textSecondary dark:text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <button 
          onClick={() => downloadCSV(energyData)}
          className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition"
        >
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((m, i) => (
          <div key={i} className="card-base p-6">
            <h3 className="text-sm text-textSecondary dark:text-gray-400 mb-2">{m.label}</h3>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{m.value}</div>
              <div className="text-sm font-medium text-teal bg-teal/10 px-2 py-1 rounded">{m.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-base p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Real-time Generation Trends</h3>
          <select className="bg-gray-100 dark:bg-gray-800 text-sm border-none rounded-lg px-3 py-1 outline-none">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
        </div>
        <p className="text-xs text-textSecondary dark:text-gray-400 mb-6">
          This chart displays total renewable grid generation trends over time with real-time updates every 10 seconds, helping identify peak production periods and seasonal anomalies.
        </p>
        <div className="h-80">
          <LineChart data={energyData?.chartData || []} />
        </div>
      </div>

      <div className="card-base overflow-hidden">
        <div className="p-6 border-b border-borderLight dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Energy Source Distribution</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedMetric('generation')}
              className={`px-3 py-1 rounded text-sm ${selectedMetric === 'generation' ? 'bg-teal text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              Generation
            </button>
            <button 
              onClick={() => setSelectedMetric('efficiency')}
              className={`px-3 py-1 rounded text-sm ${selectedMetric === 'efficiency' ? 'bg-teal text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              Efficiency
            </button>
          </div>
        </div>
        <div className="p-6 h-96 flex items-center justify-center text-textSecondary">
          <p>Detailed source distribution analysis - Solar {energyData?.solar?.power}MW | Wind {energyData?.wind?.power}MW</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
