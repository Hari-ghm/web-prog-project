import { fetchOpenWeatherData, fetchNasaPowerData } from './apiService';
import { MOCK_WIND_DATA, MOCK_SOLAR_DATA, MOCK_CHART_DATA } from './mockData';
import { generateMockCityData } from '../utils/helpers';

// Simple in-memory cache
const cache = {}; // object mapping 'lat,lon' to { data, timestamp }
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Generate dynamic chart data based on timeframe with real variation
const generateChartDataByTimeframe = (timeframe, baseData = MOCK_CHART_DATA) => {
  const timestamp = Date.now();
  const seed = Math.floor(timestamp / 1000) % 100; // Change every second for variation
  
  if (timeframe === 'Weekly') {
    return [
      { time: 'Mon', solar: 100 + seed, wind: 60 + (seed % 20) },
      { time: 'Tue', solar: 130 + seed, wind: 65 + (seed % 15) },
      { time: 'Wed', solar: 95 + seed, wind: 80 + (seed % 25) },
      { time: 'Thu', solar: 140 + seed, wind: 55 + (seed % 18) },
      { time: 'Fri', solar: 160 + seed, wind: 40 + (seed % 12) },
      { time: 'Sat', solar: 155 + seed, wind: 50 + (seed % 20) },
      { time: 'Sun', solar: 120 + seed, wind: 90 + (seed % 30) }
    ];
  } else if (timeframe === 'Monthly') {
    return [
      { time: 'Week 1', solar: 800 + seed * 10, wind: 450 + (seed % 50) },
      { time: 'Week 2', solar: 950 + seed * 10, wind: 400 + (seed % 40) },
      { time: 'Week 3', solar: 890 + seed * 10, wind: 520 + (seed % 60) },
      { time: 'Week 4', solar: 1100 + seed * 10, wind: 480 + (seed % 45) }
    ];
  } else if (timeframe === 'Yearly') {
    return [
      { time: 'Q1', solar: 3500 + seed * 20, wind: 2800 + (seed % 200) },
      { time: 'Q2', solar: 4800 + seed * 20, wind: 2200 + (seed % 150) },
      { time: 'Q3', solar: 5100 + seed * 20, wind: 2000 + (seed % 140) },
      { time: 'Q4', solar: 3200 + seed * 20, wind: 3100 + (seed % 250) }
    ];
  }
  // Daily (default)
  return [
    { time: '00:00', solar: 0 + (seed % 10), wind: 30 + (seed % 15) },
    { time: '04:00', solar: 5 + (seed % 10), wind: 35 + (seed % 18) },
    { time: '08:00', solar: 80 + seed, wind: 45 + (seed % 20) },
    { time: '12:00', solar: 150 + seed, wind: 50 + (seed % 15) },
    { time: '16:00', solar: 120 + seed, wind: 55 + (seed % 20) },
    { time: '20:00', solar: 30 + (seed % 20), wind: 40 + (seed % 18) },
    { time: '23:59', solar: 0 + (seed % 5), wind: 25 + (seed % 10) }
  ];
};

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
    // Validate weather data structure
    if (!weather || !weather.wind || !weather.main) {
      throw new Error('Invalid weather data structure');
    }
    // Convert weather wind to simulated power outputs
    windData = {
      speed: weather.wind.speed * 3.6, // m/s to km/h
      deg: weather.wind.deg || 0,
      power: Math.round((weather.wind.speed || 0) * 85), // simulated formula
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
    
    // Validate NASA POWER API response structure
    if (!nasaData || !nasaData.properties || !nasaData.properties.parameter || !nasaData.properties.parameter.ALLSKY_SFC_SW_DWN) {
      throw new Error('Invalid NASA API response structure');
    }
    
    const params = nasaData.properties.parameter.ALLSKY_SFC_SW_DWN;
    const dates = Object.keys(params).sort();
    const latestValue = params[dates[dates.length - 1]] || 0;
    
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

  // Generate timeframe-appropriate chart data with real-time variation
  const timeSeriesData = generateChartDataByTimeframe(timeframe);

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
    timeframe,
    isMock
  };

  cache[cacheKey] = {
    data: result,
    timestamp: now
  };

  return result;
};
