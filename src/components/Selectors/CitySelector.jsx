import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';

const CitySelector = () => {
  const { selectedState, selectedCity, setSelectedCity, mergedCities } = useData();
  
  // If a state has no cities defined, we default to empty array
  const cities = mergedCities[selectedState] || [];

  // Reset selected city if current state doesn't have it
  useEffect(() => {
    if (cities.length > 0 && !cities.find(c => c.id === selectedCity)) {
      setSelectedCity(cities[0].id);
    }
  }, [selectedState, cities, selectedCity, setSelectedCity]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  if (cities.length === 0) {
    return (
      <div className="text-sm px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg whitespace-nowrap">
        Coming Soon
      </div>
    );
  }

  return (
    <div className="relative">
      <select 
        value={selectedCity}
        onChange={handleCityChange}
        className="appearance-none bg-white dark:bg-darkSecondary border border-borderLight dark:border-gray-700 text-textPrimary dark:text-darkTextPrimary text-sm rounded-lg block w-40 p-2.5 focus:ring-teal focus:border-teal outline-none cursor-pointer"
      >
        <option value="all">All Cities (State View)</option>
        {cities.map(city => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <span className="text-xs">▼</span>
      </div>
    </div>
  );
};

export default CitySelector;
