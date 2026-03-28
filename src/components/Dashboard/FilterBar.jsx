import React from 'react';
import { useData } from '../../context/DataContext';

const FilterBar = () => {
  const { timeframe, setTimeframe } = useData();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-darkSecondary p-4 rounded-[12px] border border-borderLight dark:border-gray-800 mb-6 shadow-sm">
      <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
        {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((range) => (
          <button 
            key={range}
            onClick={() => setTimeframe(range)}
            className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
              timeframe === range 
                ? 'bg-navy dark:bg-teal text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-textSecondary dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        <select className="bg-gray-100 dark:bg-gray-800 text-sm border-none rounded-lg px-4 py-2 outline-none dark:text-darkTextPrimary w-full sm:w-auto cursor-pointer">
          <option>All Energy</option>
          <option>Solar Only</option>
          <option>Wind Only</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
