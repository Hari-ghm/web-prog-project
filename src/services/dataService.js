import { fetchOpenWeatherData, fetchNasaPowerData } from './apiService';
import { MOCK_WIND_DATA, MOCK_SOLAR_DATA, MOCK_CHART_DATA } from './mockData';
import { generateMockCityData } from '../utils/helpers';

// Simple in-memory cache
const cache = {}; // object mapping 'lat,lon' to { data, timestamp }
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const fetchEnergyData = async (lat, lon, timeframe = 'Daily') => {
  const now = Date.now();
  // Include timeframe in cache key so changing timeframe refetches/returns correct cache
  const cacheKey = `${lat},${lon},${timeframe}`;
  
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_EXPIRY)) {
    return cache[cacheKey].data;
  }

  let windData = null;
  let solarData = null;
  let isMock = false;

  // pseudo-random modifiers based on city coordinates to vary mock data per city
  const latMulti = 1 + ((lat % 10) / 20) - 0.25; // varies ~0.75 to ~1.25
  const lonMulti = 1 + ((lon % 10) / 20) - 0.25;

  try {
    const weather = await fetchOpenWeatherData(lat, lon);
    // Convert weather wind to simulated power outputs
    windData = {
      speed: weather.wind.speed * 3.6, // m/s to km/h
      deg: weather.wind.deg,
      power: Math.round(weather.wind.speed * 85), // simulated formula
      trend: (Math.random() * 10 - 5).toFixed(1)
    };
  } catch (err) {
    console.warn("Falling back to mock wind data", err);
    windData = {
      speed: Number((MOCK_WIND_DATA.speed * latMulti).toFixed(1)),
      deg: MOCK_WIND_DATA.deg,
      power: Math.round(MOCK_WIND_DATA.power * latMulti),
      trend: MOCK_WIND_DATA.trend
    };
    isMock = true;
  }

  try {
    const nasaData = await fetchNasaPowerData(lat, lon);
    // Extract the latest solar irradiance
    const params = nasaData.properties.parameter.ALLSKY_SFC_SW_DWN;
    const dates = Object.keys(params);
    const latestValue = params[dates[dates.length - 1]];
    
    solarData = {
      irradiance: latestValue > 0 ? latestValue.toFixed(2) : 5.5,
      power: Math.round((latestValue > 0 ? latestValue : 5.5) * 150),
      trend: (Math.random() * 8 - 4).toFixed(1)
    };
  } catch (err) {
    console.warn("Falling back to mock solar data", err);
    solarData = {
      irradiance: Number((MOCK_SOLAR_DATA.irradiance * lonMulti).toFixed(2)),
      power: Math.round(MOCK_SOLAR_DATA.power * lonMulti),
      trend: MOCK_SOLAR_DATA.trend
    };
    isMock = true;
  }

  // Generate appropriate timeframe chart data
  let timeSeriesData = MOCK_CHART_DATA;
  if (timeframe === 'Weekly') {
    timeSeriesData = [
      { time: 'Mon', solar: 100, wind: 60 }, { time: 'Tue', solar: 130, wind: 65 },
      { time: 'Wed', solar: 95, wind: 80 }, { time: 'Thu', solar: 140, wind: 55 },
      { time: 'Fri', solar: 160, wind: 40 }, { time: 'Sat', solar: 155, wind: 50 },
      { time: 'Sun', solar: 120, wind: 90 }
    ];
  } else if (timeframe === 'Monthly') {
    timeSeriesData = [
      { time: 'Week 1', solar: 800, wind: 450 }, { time: 'Week 2', solar: 950, wind: 400 },
      { time: 'Week 3', solar: 890, wind: 520 }, { time: 'Week 4', solar: 1100, wind: 480 }
    ];
  } else if (timeframe === 'Yearly') {
    timeSeriesData = [
      { time: 'Q1', solar: 3500, wind: 2800 }, { time: 'Q2', solar: 4800, wind: 2200 },
      { time: 'Q3', solar: 5100, wind: 2000 }, { time: 'Q4', solar: 3200, wind: 3100 }
    ];
  }

  const result = {
    wind: windData,
    solar: solarData,
    total: windData.power + solarData.power,
    chartData: timeSeriesData.map(d => ({
      ...d,
      // applying multipliers based on location hash logic
      solar: Math.round(d.solar * lonMulti),
      wind: Math.round(d.wind * latMulti)
    })),
    cityData: generateMockCityData(),
    isMock
  };

  cache[cacheKey] = {
    data: result,
    timestamp: now
  };

  return result;
};
