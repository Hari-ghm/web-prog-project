import React from 'react';
import { useData } from '../context/DataContext';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { getGreeting } from '../utils/formatters';

import OverviewCards from '../components/Dashboard/OverviewCards';
import FilterBar from '../components/Dashboard/FilterBar';
import LineChart from '../components/Charts/LineChart';
import PieChart from '../components/Charts/PieChart';
import BarChart from '../components/Charts/BarChart';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorBoundary from '../components/Common/ErrorBoundary';

const Dashboard = () => {
  const { energyData, loading, selectedState, selectedCity, mergedStates, mergedCities } = useData();

  // Enable real-time updates for this page
  useRealTimeData();

  if (loading && !energyData) {
    return <LoadingSpinner />;
  }

  const stateName = mergedStates.find((s) => s.id === selectedState)?.name || selectedState;
  const cities = mergedCities[selectedState] || [];
  const cityName = cities.find((c) => c.id === selectedCity)?.name || 'N/A';

  const isAllCities = selectedCity === 'all';

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{getGreeting()}</h1>
        <div className="flex flex-wrap items-center gap-3 text-textSecondary dark:text-gray-400">
          <span className="bg-white dark:bg-darkSecondary px-3 py-1 rounded-full text-sm border border-borderLight dark:border-gray-800 shadow-sm">
            {stateName}
          </span>
          {cityName !== 'N/A' && (
            <>
              <span>&bull;</span>
              <span className="text-sm font-medium">{cityName}</span>
            </>
          )}
        </div>
      </div>

      {cities.length === 0 && (
        <div className="card-base p-4 mb-6 border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10">
          <p className="text-sm text-textSecondary dark:text-gray-300">
            No city coordinates found for <span className="font-medium">{stateName}</span>. Add at least one city with latitude and longitude in Admin Console to start live monitoring.
          </p>
        </div>
      )}

      {/* Main Dashboard Content */}
      <ErrorBoundary fallbackMessage="Failed to load overview metrics">
        <OverviewCards />
      </ErrorBoundary>

      <FilterBar />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Top Left: Line Chart */}
        <div className="card-base p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Energy Generation Trend</h3>
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">7 Days</span>
          </div>
          <ErrorBoundary fallbackMessage="Chart data unavailable - Estimated Values">
            <LineChart data={energyData?.chartData || []} />
          </ErrorBoundary>
        </div>

        {/* Top Right: Pie Chart */}
        <div className={`card-base p-6 ${!isAllCities ? 'xl:col-span-1' : ''}`}>
          <h3 className="font-semibold text-lg mb-4">Energy Mix</h3>
          <ErrorBoundary fallbackMessage="Chart data unavailable - Estimated Values">
            <PieChart solar={energyData?.solar.power || 0} wind={energyData?.wind.power || 0} />
          </ErrorBoundary>
        </div>

        {/* Bottom Left: Bar Chart (ONLY FOR STATE LEVEL VIEW) */}
        {isAllCities && (
          <div className="card-base p-6">
            <h3 className="font-semibold text-lg mb-4">City Performance Distribution</h3>
            <p className="text-xs text-textSecondary dark:text-gray-400 mb-4">Compares generation output distinctly across all registered cities within the state.</p>
            <ErrorBoundary fallbackMessage="Chart data unavailable - Estimated Values">
              <BarChart data={energyData?.cityData || []} />
            </ErrorBoundary>
          </div>
        )}

        {/* Bottom Right: Efficiency Metrics */}
        <div className={`card-base p-6 flex flex-col ${!isAllCities ? 'xl:col-span-2 grid grid-cols-2 gap-8' : ''}`}>
          <h3 className="font-semibold text-lg mb-6">Efficiency Metrics</h3>

          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-textSecondary dark:text-gray-400">Solar Panel Efficiency</span>
                <span className="text-sm font-bold text-teal">92%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                <div className="bg-teal h-2.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-textSecondary dark:text-gray-400">Wind Turbine Uptime</span>
                <span className="text-sm font-bold text-blue">97.5%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                <div className="bg-blue h-2.5 rounded-full" style={{ width: '97.5%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-textSecondary dark:text-gray-400">Grid Distribution Success</span>
                <span className="text-sm font-bold text-green-500">99.1%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '99.1%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
