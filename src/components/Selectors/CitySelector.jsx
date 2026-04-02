import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';

const CitySelector = () => {
  const { selectedState, selectedCity, setSelectedCity, mergedCities } = useData();

  const cities = mergedCities[selectedState] || [];

  // Keep selection valid when state changes.
  useEffect(() => {
    if (cities.length === 0) {
      if (selectedCity !== 'all') {
        setSelectedCity('all');
      }
      return;
    }

    if (selectedCity === 'all') return;

    const cityExists = cities.some((c) => c.id === selectedCity);
    if (!cityExists) {
      setSelectedCity(cities[0].id);
    }
  }, [cities, selectedCity, setSelectedCity]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="relative">
      <select
        value={selectedCity}
        onChange={handleCityChange}
        className="appearance-none bg-white dark:bg-darkSecondary border border-borderLight dark:border-gray-700 text-textPrimary dark:text-darkTextPrimary text-sm rounded-lg block w-40 p-2.5 focus:ring-teal focus:border-teal outline-none cursor-pointer"
      >
        {cities.length === 0 ? (
          <option value="all">All Cities</option>
        ) : (
          cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))
        )}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <span className="text-xs">v</span>
      </div>
    </div>
  );
};

export default CitySelector;

