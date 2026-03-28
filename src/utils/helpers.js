export const generateMockChartData = (days = 7) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      time: date.toLocaleDateString('en-US', { weekday: 'short' }),
      solar: Math.floor(Math.random() * 500) + 800,
      wind: Math.floor(Math.random() * 600) + 400,
    });
  }
  return data;
};

export const generateMockCityData = () => {
  return [
    { name: 'Chennai', solar: 1200, wind: 800 },
    { name: 'Coimbatore', solar: 950, wind: 1100 },
    { name: 'Madurai', solar: 1300, wind: 400 },
    { name: 'Tiruchirappalli', solar: 1100, wind: 500 },
  ];
};

export const calculateVariations = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};
