import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = 'Chennai'; // Default city

  if (!apiKey) {
    return NextResponse.json({ 
      stats: [
        { name: 'Missing Key (Temp)', value: 'Restart', change: 'Restart Dev Server', type: 'negative' },
        { name: 'Missing Key (Hum)', value: 'Restart', change: 'Restart Dev Server', type: 'negative' },
        { name: 'Missing Key (Wind)', value: 'Restart', change: 'Restart Dev Server', type: 'negative' },
        { name: 'Missing Key (Cloud)', value: 'Restart', change: 'Restart Dev Server', type: 'negative' },
      ]
    });
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
        throw new Error('Weather API returned ' + response.status);
    }
    
    const weatherData = await response.json();

    // Extract real data points using WeatherAPI.com format
    const temp = `${Math.round(weatherData.current.temp_c)}°C`;
    const humidity = `${weatherData.current.humidity}%`;
    const wind = `${Math.round(weatherData.current.wind_kph)} km/h`;
    const clouds = `${weatherData.current.cloud}%`;
    
    const conditions = weatherData.current.condition.text;
    let weatherType = 'warning';
    
    if (conditions.includes('Clear') || conditions.includes('Sunny')) weatherType = 'positive';
    else if (conditions.includes('Rain') || conditions.includes('Snow') || conditions.includes('Storm') || conditions.includes('Thunder')) weatherType = 'negative';

    const stats = [
      { name: `Temperature (${weatherData.location.name || city})`, value: temp, change: conditions, type: weatherType },
      { name: 'Humidity Level', value: humidity, change: 'Moisture', type: 'warning' },
      { name: 'Wind Speed', value: wind, change: `Dir: ${weatherData.current.wind_dir}`, type: 'positive' },
      { name: 'Cloud Coverage', value: clouds, change: 'Solar Blocker', type: 'negative' },
    ];

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('Weather API fetch failed:', error);
    
    const is401 = error.message.includes('401') || error.message.includes('403');
    const msg = is401 ? 'Check API Key' : 'Fetch Failed';

    return NextResponse.json({ 
      stats: [
        { name: 'API Error (Temp)', value: 'Error', change: msg, type: 'negative' },
        { name: 'API Error (Humidity)', value: 'Error', change: msg, type: 'negative' },
        { name: 'API Error (Wind)', value: 'Error', change: msg, type: 'negative' },
        { name: 'API Error (Clouds)', value: 'Error', change: msg, type: 'negative' },
      ]
    });
  }
}
