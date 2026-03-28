export const statesWithCities: Record<string, string[]> = {
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul',
    'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur', 'Kanchipuram',
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam',
    'Palakkad', 'Alappuzha', 'Kannur', 'Kottayam', 'Malappuram',
  ],
  'Karnataka': [
    'Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli', 'Belgaum',
    'Davangere', 'Bellary', 'Gulbarga', 'Shimoga', 'Tumkur',
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
    'Tirupati', 'Rajahmundry', 'Kakinada', 'Kadapa', 'Anantapur',
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam',
    'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Siddipet',
  ],
  'Puducherry': [
    'Puducherry', 'Karaikal', 'Mahe', 'Yanam',
  ],
};

export const allStates = Object.keys(statesWithCities);

export function getCitiesForState(state: string): string[] {
  return statesWithCities[state] || [];
}

// Approximate lat/lng for map markers (South Indian cities)
export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  // Tamil Nadu
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
  'Salem': { lat: 11.6643, lng: 78.1460 },
  'Tirunelveli': { lat: 8.7139, lng: 77.7567 },
  'Erode': { lat: 11.3410, lng: 77.7172 },
  'Vellore': { lat: 12.9165, lng: 79.1325 },
  'Thoothukudi': { lat: 8.7642, lng: 78.1348 },
  'Dindigul': { lat: 10.3624, lng: 77.9695 },
  'Thanjavur': { lat: 10.7870, lng: 79.1378 },
  'Ranipet': { lat: 12.9322, lng: 79.3213 },
  'Sivakasi': { lat: 9.4533, lng: 77.7981 },
  'Karur': { lat: 10.9601, lng: 78.0766 },
  'Kanchipuram': { lat: 12.8342, lng: 79.7036 },
  // Kerala
  'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
  'Kochi': { lat: 9.9312, lng: 76.2673 },
  'Kozhikode': { lat: 11.2588, lng: 75.7804 },
  'Thrissur': { lat: 10.5276, lng: 76.2144 },
  'Kollam': { lat: 8.8932, lng: 76.6141 },
  'Palakkad': { lat: 10.7867, lng: 76.6548 },
  'Alappuzha': { lat: 9.4981, lng: 76.3388 },
  'Kannur': { lat: 11.8745, lng: 75.3704 },
  'Kottayam': { lat: 9.5916, lng: 76.5222 },
  'Malappuram': { lat: 11.0510, lng: 76.0711 },
  // Karnataka
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Mysuru': { lat: 12.2958, lng: 76.6394 },
  'Mangaluru': { lat: 12.9141, lng: 74.8560 },
  'Hubli': { lat: 15.3647, lng: 75.1240 },
  'Belgaum': { lat: 15.8497, lng: 74.4977 },
  'Davangere': { lat: 14.4644, lng: 75.9218 },
  'Bellary': { lat: 15.1394, lng: 76.9214 },
  'Gulbarga': { lat: 17.3297, lng: 76.8343 },
  'Shimoga': { lat: 13.9299, lng: 75.5681 },
  'Tumkur': { lat: 13.3379, lng: 77.1173 },
  // Andhra Pradesh
  'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'Vijayawada': { lat: 16.5062, lng: 80.6480 },
  'Guntur': { lat: 16.3067, lng: 80.4365 },
  'Nellore': { lat: 14.4426, lng: 79.9865 },
  'Kurnool': { lat: 15.8281, lng: 78.0373 },
  'Tirupati': { lat: 13.6288, lng: 79.4192 },
  'Rajahmundry': { lat: 17.0005, lng: 81.8040 },
  'Kakinada': { lat: 16.9891, lng: 82.2475 },
  'Kadapa': { lat: 14.4674, lng: 78.8241 },
  'Anantapur': { lat: 14.6819, lng: 77.6006 },
  // Telangana
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Warangal': { lat: 17.9784, lng: 79.5941 },
  'Nizamabad': { lat: 18.6725, lng: 78.0940 },
  'Karimnagar': { lat: 18.4386, lng: 79.1288 },
  'Khammam': { lat: 17.2473, lng: 80.1514 },
  'Mahbubnagar': { lat: 16.7488, lng: 77.9850 },
  'Nalgonda': { lat: 17.0575, lng: 79.2690 },
  'Adilabad': { lat: 19.6641, lng: 78.5320 },
  'Suryapet': { lat: 17.1383, lng: 79.6262 },
  'Siddipet': { lat: 18.1019, lng: 78.8520 },
  // Puducherry
  'Puducherry': { lat: 11.9416, lng: 79.8083 },
  'Karaikal': { lat: 10.9254, lng: 79.8380 },
  'Mahe': { lat: 11.7036, lng: 75.5354 },
  'Yanam': { lat: 16.7307, lng: 82.2137 },
};
