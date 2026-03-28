import React, { useState, useEffect } from 'react';
import { fetchOpenWeatherData } from '../services/apiService';

const GLOBAL_REGIONS = [
  { id: 'india', name: 'India (New Delhi)', lat: 28.6139, lon: 77.2090, bg: 'from-orange-400 to-red-500' },
  { id: 'usa', name: 'USA (New York)', lat: 40.7128, lon: -74.0060, bg: 'from-blue to-indigo-600' },
  { id: 'china', name: 'China (Beijing)', lat: 39.9042, lon: 116.4074, bg: 'from-rose-500 to-red-700' },
  { id: 'uk', name: 'UK (London)', lat: 51.5074, lon: -0.1278, bg: 'from-gray-400 to-slate-600' },
  { id: 'australia', name: 'Australia (Sydney)', lat: -33.8688, lon: 151.2093, bg: 'from-yellow-400 to-orange-500' },
  { id: 'brazil', name: 'Brazil (Brasília)', lat: -15.8267, lon: -47.9218, bg: 'from-emerald-400 to-green-600' }
];

const GlobalWeather = () => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [loadingObj, setLoadingObj] = useState({});

  const handleMouseEnter = async (region) => {
    setHoveredRegion(region.id);
    
    // Only fetch if we haven't already fetched it successfully during this session
    if (!weatherData[region.id] && !loadingObj[region.id]) {
      setLoadingObj(prev => ({ ...prev, [region.id]: true }));
      try {
        const data = await fetchOpenWeatherData(region.lat, region.lon);
        setWeatherData(prev => ({
          ...prev,
          [region.id]: {
            temp: Math.round(data.main.temp),
            main: data.weather[0].main,
            wind: (data.wind.speed * 3.6).toFixed(1), // m/s to km/h
            humidity: data.main.humidity,
            isMock: false
          }
        }));
      } catch (err) {
        // Fallback mock weather for regions if API fails or no key
        setWeatherData(prev => ({
          ...prev,
          [region.id]: {
            temp: Math.round(20 + Math.random() * 15),
            main: ['Clear', 'Clouds', 'Rain', 'Thunderstorm'][Math.floor(Math.random() * 4)],
            wind: (Math.random() * 20 + 5).toFixed(1),
            humidity: Math.round(40 + Math.random() * 40),
            isMock: true
          }
        }));
      } finally {
        setLoadingObj(prev => ({ ...prev, [region.id]: false }));
      }
    }
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* Ticker Tape */}
      <div className="w-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm py-2 px-4 mb-8 rounded-lg border border-amber-200 dark:border-amber-800/50 flex items-center shadow-sm overflow-hidden">
        <span className="font-bold mr-4 shrink-0 px-2 py-0.5 bg-amber-200 dark:bg-amber-800 rounded text-xs uppercase tracking-wider">Alert</span>
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          ⚠️ severe thunderstorm warning for northern usa • high wind advisory in coastal australia • elevated UV index across central india • heavy rain probabilities in UK south
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Global Live Weather Map</h1>
        <p className="text-textSecondary dark:text-gray-400">Hover over any key region to instantly fetch its live environmental conditions via API.</p>
      </div>

      {/* Grid of Regions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GLOBAL_REGIONS.map((region) => {
          const isHovered = hoveredRegion === region.id;
          const data = weatherData[region.id];
          const isLoading = loadingObj[region.id];

          return (
            <div 
              key={region.id}
              onMouseEnter={() => handleMouseEnter(region)}
              onMouseLeave={() => setHoveredRegion(null)}
              className={`relative h-48 rounded-[16px] overflow-hidden shadow-md transition-all duration-300 transform cursor-pointer ${isHovered ? 'scale-105 ring-4 ring-teal/50 z-10' : 'bg-gray-100 dark:bg-darkSecondary'}`}
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br opacity-80 ${region.bg}`}></div>
              
              {/* Text content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white drop-shadow-md">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xl drop-shadow-md">{region.name}</h3>
                </div>

                <div className="flex-1 flex items-end">
                  {!isHovered && !data && (
                    <span className="text-white/70 text-sm">Hover to load weather...</span>
                  )}
                  
                  {isLoading && (
                    <div className="animate-pulse text-white/90">Connecting to satellites...</div>
                  )}

                  {data && !isLoading && (
                    <div className={`transition-opacity duration-300 w-full ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-3xl font-bold">{data.temp}°C</div>
                          <div className="text-sm opacity-90">{data.main}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm bg-black/20 px-2 py-1 rounded inline-block backdrop-blur border border-white/10 mb-1">{data.wind} km/h Wind</div>
                          <div className="text-sm bg-black/20 px-2 py-1 rounded inline-block backdrop-blur border border-white/10">{data.humidity}% Humidity</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Add Marquee Keyframe locally if not in tailwind config */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  );
};

export default GlobalWeather;
