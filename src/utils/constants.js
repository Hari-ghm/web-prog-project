export const STATES = [
  { id: 'tamil-nadu', name: 'Tamil Nadu', active: true },
  { id: 'kerala', name: 'Kerala', active: false },
  { id: 'karnataka', name: 'Karnataka', active: false }
];

export const CITIES = {
  'tamil-nadu': [
    { id: 'chennai', name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { id: 'coimbatore', name: 'Coimbatore', lat: 11.0168, lon: 76.9558 },
    { id: 'madurai', name: 'Madurai', lat: 9.9252, lon: 78.1198 },
    { id: 'tiruchirappalli', name: 'Tiruchirappalli', lat: 10.7905, lon: 78.7047 }
  ]
};

export const TIME_RANGES = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' }
];

export const REFRESH_INTERVALS = [
  { id: '10s', label: '10 seconds', ms: 10000 },
  { id: '30s', label: '30 seconds', ms: 30000 },
  { id: '1m', label: '1 minute', ms: 60000 },
  { id: '5m', label: '5 minutes', ms: 300000 }
];
