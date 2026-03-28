import React from 'react';
import { formatNumber } from '../../utils/formatters';

const StatsCard = ({ title, value, trend, subtext, type = "default" }) => {
  // Determine trend color
  const isPositive = parseFloat(trend) > 0;
  const trendColor = isPositive 
    ? "text-green-600 dark:text-green-400" 
    : "text-red-600 dark:text-red-400";
    
  return (
    <div className="card-base p-6 hover:-translate-y-1 transition-transform duration-300">
      <h3 className="text-textSecondary dark:text-gray-400 text-sm font-medium mb-4">{title}</h3>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-2xl lg:text-3xl font-bold">{formatNumber(value)} <span className="text-sm font-normal text-textSecondary dark:text-gray-500">MWh</span></span>
        <span className={`text-sm font-semibold px-2 py-1 rounded-full bg-opacity-10 dark:bg-opacity-20 ${
          isPositive ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
        }`}>
          {isPositive ? '+' : ''}{trend}%
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
        {subtext}
      </p>
    </div>
  );
};

export default StatsCard;
