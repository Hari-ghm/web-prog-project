import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import LineChart from '../components/Charts/LineChart';
import PieChart from '../components/Charts/PieChart';
import BarChart from '../components/Charts/BarChart';

const Energy = () => {
  const { energyData } = useData();
  const [activeTab, setActiveTab] = useState('solar'); // 'solar' or 'wind'

  if (!energyData) {
    return <div className="p-8 text-center text-textSecondary">Loading Energy Infrastructure Data...</div>;
  }

  const isSolar = activeTab === 'solar';
  const dataNode = isSolar ? energyData.solar : energyData.wind;
  
  // Custom structured regression style visual map
  const treeNodes = isSolar 
    ? [{ label: 'Solar Irradiance', val: `${dataNode.irradiance} W/m²` }, { label: 'Panel Array 1', val: 'Online' }, { label: 'Inverter Bank', val: '98% Eff' }]
    : [{ label: 'Wind Speed', val: `${dataNode.speed} km/h` }, { label: 'Turbine Hub A', val: 'Active' }, { label: 'Generator RPM', val: '1450 RPM' }];

  return (
    <div className="animate-fade-in pb-8">
      <h1 className="text-2xl font-bold mb-6">Energy Source Analysis</h1>
      
      {/* Toggle Bar */}
      <div className="flex bg-gray-100 dark:bg-darkSecondary p-1 rounded-lg w-fit mb-8 shadow-sm border border-borderLight dark:border-gray-800">
        <button 
          onClick={() => setActiveTab('solar')}
          className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${isSolar ? 'bg-white dark:bg-gray-700 shadow text-teal' : 'text-gray-500 hover:text-textPrimary'}`}
        >
          Solar Energy
        </button>
        <button 
          onClick={() => setActiveTab('wind')}
          className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${!isSolar ? 'bg-white dark:bg-gray-700 shadow text-blue' : 'text-gray-500 hover:text-textPrimary'}`}
        >
          Wind Energy
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card-base p-6 bg-gradient-to-br from-white to-gray-50 dark:from-darkSecondary dark:to-gray-900 border-t-4 border-t-teal">
          <h3 className="text-textSecondary dark:text-gray-400 text-sm mb-1">{isSolar ? 'Total Direct Solar Irradiance' : 'Average Wind Velocity'}</h3>
          <p className="text-3xl font-bold">{isSolar ? `${dataNode.irradiance} W/m²` : `${dataNode.speed} km/h`}</p>
        </div>
        <div className="card-base p-6 bg-gradient-to-br from-white to-gray-50 dark:from-darkSecondary dark:to-gray-900 border-t-4 border-t-blue">
          <h3 className="text-textSecondary dark:text-gray-400 text-sm mb-1">Grid Power Output</h3>
          <p className="text-3xl font-bold">{dataNode.power} <span className="text-lg text-gray-400 font-normal">MWh</span></p>
        </div>
        <div className="card-base p-6 bg-gradient-to-br from-white to-gray-50 dark:from-darkSecondary dark:to-gray-900 border-t-4 border-t-indigo-500">
          <h3 className="text-textSecondary dark:text-gray-400 text-sm mb-1">Production Trend (Linear Regression)</h3>
          <p className={`text-3xl font-bold ${dataNode.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {dataNode.trend > 0 ? '+' : ''}{dataNode.trend}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Isolated Line Chart for specific energy */}
        <div className="card-base p-6">
          <h3 className="font-semibold text-lg mb-2">{isSolar ? 'Solar' : 'Wind'} Temporal Generation Curve</h3>
          <p className="text-xs text-gray-500 mb-6 font-medium">This chart isolates the specific output volume generated strictly by {isSolar ? 'Solar Panels' : 'Wind Turbines'} along the selected timeframe.</p>
          <LineChart data={energyData.chartData} />
        </div>

        {/* Structured Tree Visualization */}
        <div className="card-base p-6 flex flex-col">
          <h3 className="font-semibold text-lg mb-2">Infrastructure Data Flow</h3>
          <p className="text-xs text-gray-500 mb-6 font-medium">A structured visualization of the internal telemetry sequence from environmental harvesting to grid conversion.</p>
          
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {treeNodes.map((node, i) => (
              <div key={i} className="flex items-center">
                <div className="w-1/3 text-right pr-4 font-medium text-sm text-textSecondary dark:text-gray-300">
                  {node.label}
                </div>
                <div className="w-8 h-px bg-gray-300 dark:bg-gray-700 relative">
                  <div className="absolute right-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-teal"></div>
                </div>
                <div className="w-1/2 pl-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm inline-block font-mono">
                    {node.val}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Energy;
