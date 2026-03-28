import React from 'react';
import LineChart from '../components/Charts/LineChart';
import { useData } from '../context/DataContext';
import { downloadCSV } from '../utils/exportUtils';

const Analytics = () => {
  const { energyData } = useData();

  const metrics = [
    { label: 'Average Daily Generation', value: '1,420 MWh', trend: '+5.2%' },
    { label: 'Peak Generation Day', value: 'Tuesday', trend: 'Highest' },
    { label: 'Weather Impact', value: '+15%', trend: 'Sunny days' },
  ];

  return (
    <div className="animate-fade-in pb-8">
      <h1 className="text-2xl font-bold mb-6">Analytics Deep Dive</h1>

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
            <h3 className="font-semibold text-lg">Historical Generation Trends (30 Days)</h3>
            <select className="bg-gray-100 dark:bg-gray-800 text-sm border-none rounded-lg px-3 py-1 outline-none">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <p className="text-xs text-textSecondary dark:text-gray-400 mb-6">
            This chart isolates total renewable grid generation trends over time, helping identify peak production periods and potential seasonal performance anomalies.
          </p>
        <div className="h-80">
          <LineChart data={energyData?.chartData ? [...energyData.chartData, ...energyData.chartData].map((d, i) => ({...d, time: `Day ${i+1}`})) : []} />
        </div>
      </div>

      <div className="card-base overflow-hidden">
        <div className="p-6 border-b border-borderLight dark:border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Daily Generation Table</h3>
            <p className="text-xs text-textSecondary dark:text-gray-400 mt-1">Raw tabular output showing discrete hourly/daily generation figures for manual inspection.</p>
          </div>
          <button onClick={() => downloadCSV(energyData)} className="text-sm font-medium text-teal hover:underline px-3 py-1 bg-teal/5 rounded transition-all">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-textSecondary dark:text-gray-400">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Solar (MWh)</th>
                <th className="px-6 py-4">Wind (MWh)</th>
                <th className="px-6 py-4">Total (MWh)</th>
                <th className="px-6 py-4">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {energyData?.chartData?.map((row, idx) => (
                <tr key={idx} className="bg-white border-b dark:bg-darkSecondary dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{row.time}</td>
                  <td className="px-6 py-4">{row.solar}</td>
                  <td className="px-6 py-4">{row.wind}</td>
                  <td className="px-6 py-4 font-semibold">{row.solar + row.wind}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Optimal</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
