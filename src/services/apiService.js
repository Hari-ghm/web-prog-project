const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const NASA_POWER_KEY = import.meta.env.VITE_NASA_POWER_API_KEY;

export const fetchOpenWeatherData = async (lat, lon) => {
  if (!OPENWEATHER_KEY || OPENWEATHER_KEY === 'your_openweather_api_key_here') {
    throw new Error('OpenWeather API Key missing');
  }
  
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`
  );
  
  if (!response.ok) throw new Error('OpenWeather API failed');
  return response.json();
};

export const fetchNasaPowerData = async (lat, lon) => {
  // NASA POWER doesn't strictly require an API key for basic community access
  // but we'll use it if provided. Using a generic REST endpoint for solar insolation.
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 7);
  
  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
  };

  const startStr = formatDate(start);
  const endStr = formatDate(today);

  const response = await fetch(
    `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${lon}&latitude=${lat}&start=${startStr}&end=${endStr}&format=JSON`
  );

  if (!response.ok) throw new Error('NASA POWER API failed');
  return response.json();
};
