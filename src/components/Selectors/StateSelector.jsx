import React from 'react';
import { useData } from '../../context/DataContext';

const StateSelector = () => {
  const { selectedState, setSelectedState, mergedStates } = useData();

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  return (
    <div className="relative">
      <select 
        value={selectedState}
        onChange={handleStateChange}
        className="appearance-none bg-white dark:bg-darkSecondary border border-borderLight dark:border-gray-700 text-textPrimary dark:text-darkTextPrimary text-sm rounded-lg block w-40 p-2.5 focus:ring-teal focus:border-teal outline-none cursor-pointer"
      >
        {mergedStates.map(state => (
          <option key={state.id} value={state.id} disabled={state.active === false}>
            {state.name} {state.active === false ? '(Coming Soon)' : ''}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <span className="text-xs">▼</span>
      </div>
    </div>
  );
};

export default StateSelector;
