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
  ],
  'kerala': [
    { id: 'kochi', name: 'Kochi', lat: 9.9312, lon: 76.2673 },
    { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366 },
    { id: 'kozhikode', name: 'Kozhikode', lat: 11.2588, lon: 75.7804 },
    { id: 'alappuzha', name: 'Alappuzha', lat: 9.4981, lon: 76.3388 }
  ],
  'karnataka': [
    { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
    { id: 'mysore', name: 'Mysore', lat: 12.2958, lon: 76.6394 },
    { id: 'hubballi', name: 'Hubballi', lat: 15.3647, lon: 75.1240 },
    { id: 'mangalore', name: 'Mangalore', lat: 12.8654, lon: 74.8477 }
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
