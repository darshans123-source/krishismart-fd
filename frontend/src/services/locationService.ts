// Location service for real-time browser geolocation and reverse geocoding
// Supports fallback to major Indian agricultural regions and centroid matching

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationAddress {
  village?: string;
  district: string;
  state: string;
  country: string;
  formatted: string;
}

export interface LocationState {
  coordinates: Coordinates | null;
  address: LocationAddress;
  source: 'gps' | 'manual' | 'cache' | 'default';
  status: 'idle' | 'loading' | 'granted' | 'denied' | 'unavailable' | 'timeout' | 'error';
  errorMessage?: string;
  lastUpdated: string;
}

// Major Indian agricultural districts with precise GPS centroids
export const AGRI_DISTRICT_CENTROIDS: Record<string, { lat: number; lng: number; state: string; village?: string }> = {
  // Karnataka
  "Mandya": { lat: 12.5244, lng: 76.8958, state: "Karnataka", village: "Pandavapura" },
  "Raichur": { lat: 16.2120, lng: 77.3439, state: "Karnataka", village: "Sindhanur" },
  "Mysuru": { lat: 12.2958, lng: 76.6394, state: "Karnataka", village: "Bandipalya" },
  "Kolar": { lat: 13.1378, lng: 78.1348, state: "Karnataka", village: "Srinivaspur" },
  "Belagavi": { lat: 15.8497, lng: 74.4977, state: "Karnataka", village: "Athani" },
  "Dharwad": { lat: 15.4589, lng: 75.0078, state: "Karnataka", village: "Hubballi" },
  "Ballari": { lat: 15.1394, lng: 76.9214, state: "Karnataka", village: "Siruguppa" },
  "Kalaburagi": { lat: 17.3297, lng: 76.8343, state: "Karnataka", village: "Aland" },
  "Vijayapura": { lat: 16.8302, lng: 75.7100, state: "Karnataka", village: "Indi" },
  "Shivamogga": { lat: 13.9299, lng: 75.5681, state: "Karnataka", village: "Bhadravati" },
  "Hassan": { lat: 13.0072, lng: 76.1030, state: "Karnataka", village: "Channarayapatna" },
  "Tumakuru": { lat: 13.3379, lng: 77.1173, state: "Karnataka", village: "Tiptur" },
  "Bengaluru Rural": { lat: 13.2417, lng: 77.7126, state: "Karnataka", village: "Doddaballapur" },
  "Bengaluru Urban": { lat: 12.9716, lng: 77.5946, state: "Karnataka", village: "Yeshwanthpur" },
  "Chitradurga": { lat: 14.2251, lng: 76.3980, state: "Karnataka", village: "Challakere" },
  "Davanagere": { lat: 14.4644, lng: 75.9218, state: "Karnataka", village: "Harihar" },

  // Maharashtra
  "Pune": { lat: 18.5204, lng: 73.8567, state: "Maharashtra", village: "Junnar" },
  "Nashik": { lat: 19.9975, lng: 73.7898, state: "Maharashtra", village: "Lasalgaon" },
  "Solapur": { lat: 17.6599, lng: 75.9064, state: "Maharashtra", village: "Barshi" },
  "Kolhapur": { lat: 16.7050, lng: 74.2433, state: "Maharashtra", village: "Shirol" },
  "Nagpur": { lat: 21.1458, lng: 79.0882, state: "Maharashtra", village: "Katol" },
  "Aurangabad": { lat: 19.8762, lng: 75.3433, state: "Maharashtra", village: "Gangapur" },
  "Ahmednagar": { lat: 19.0952, lng: 74.7496, state: "Maharashtra", village: "Rahuri" },
  "Sangli": { lat: 16.8524, lng: 74.5815, state: "Maharashtra", village: "Tasgaon" },

  // Andhra Pradesh & Telangana
  "Guntur": { lat: 16.3067, lng: 80.4365, state: "Andhra Pradesh", village: "Tenali" },
  "Kurnool": { lat: 15.8281, lng: 78.0373, state: "Andhra Pradesh", village: "Adoni" },
  "Krishna": { lat: 16.1875, lng: 81.1389, state: "Andhra Pradesh", village: "Gudivada" },
  "Hyderabad": { lat: 17.3850, lng: 78.4867, state: "Telangana", village: "Bowenpally" },
  "Warangal Urban": { lat: 17.9689, lng: 79.5941, state: "Telangana", village: "Enumamula" },

  // Tamil Nadu
  "Coimbatore": { lat: 11.0168, lng: 76.9558, state: "Tamil Nadu", village: "Pollachi" },
  "Erode": { lat: 11.3410, lng: 77.7172, state: "Tamil Nadu", village: "Perundurai" },
  "Madurai": { lat: 9.9252, lng: 78.1198, state: "Tamil Nadu", village: "Melur" },
  "Salem": { lat: 11.6643, lng: 78.1460, state: "Tamil Nadu", village: "Attur" },
  "Thanjavur": { lat: 10.7870, lng: 79.1378, state: "Tamil Nadu", village: "Kumbakonam" },

  // Punjab & Haryana
  "Ludhiana": { lat: 30.9010, lng: 75.8573, state: "Punjab", village: "Samrala" },
  "Karnal": { lat: 29.6857, lng: 76.9905, state: "Haryana", village: "Gharaunda" },
  "Amritsar": { lat: 31.6340, lng: 74.8723, state: "Punjab", village: "Ajnala" },

  // Uttar Pradesh & Madhya Pradesh
  "Varanasi": { lat: 25.3176, lng: 82.9739, state: "Uttar Pradesh", village: "Pindra" },
  "Indore": { lat: 22.7196, lng: 75.8577, state: "Madhya Pradesh", village: "Sanwer" },
  "Bhopal": { lat: 23.2599, lng: 77.4126, state: "Madhya Pradesh", village: "Berasia" }
};

const STORAGE_KEY = 'krishi_user_location';

/**
 * Calculates geodesic distance between two points using the Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Find nearest registered agricultural district centroid for a given lat/lng
 */
export function findNearestDistrict(lat: number, lng: number): { district: string; state: string; village: string; distanceKm: number } {
  let nearestDistrict = "Raichur";
  let nearestState = "Karnataka";
  let nearestVillage = "Sindhanur";
  let minDistance = Infinity;

  for (const [district, data] of Object.entries(AGRI_DISTRICT_CENTROIDS)) {
    const dist = calculateDistanceKm(lat, lng, data.lat, data.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestDistrict = district;
      nearestState = data.state;
      nearestVillage = data.village || district;
    }
  }

  return {
    district: nearestDistrict,
    state: nearestState,
    village: nearestVillage,
    distanceKm: minDistance
  };
}

function cleanDistrictName(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/ district/i, '').trim();
}

function isValidDistrict(district: string, state: string, country: string): boolean {
  if (!district || district.length <= 2) return false;
  if (district === state || district === country) return false;
  // A 2-letter state code (e.g. "KA") must never be treated as a district.
  if (/^[A-Z]{2}$/.test(district)) return false;
  return true;
}

/**
 * Reverse geocodes coordinates to village/area, district, state, country
 */
export async function reverseGeocode(lat: number, lng: number): Promise<LocationAddress> {
  // First try BigDataCloud's free client reverse geocoding API (Fast, reliable, CORS enabled)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const state = data.principalSubdivision || 'Karnataka';
      const country = data.countryName || 'India';
      const village = data.locality || data.city || '';
      const adminNames: string[] = (data.localityInfo?.administrative || [])
        .map((a: { name?: string }) => a.name)
        .filter((n: unknown): n is string => typeof n === 'string' && n.length > 0);
      // Administrative levels are not at a fixed index for every place in
      // India, so prefer an explicit "district" entry, then the first
      // administrative name that is neither the state nor the country.
      // Never fall back to principalSubdivisionCode ("KA") as a district.
      const district =
        cleanDistrictName(adminNames.find((n) => /district/i.test(n))) ||
        cleanDistrictName(
          adminNames.find((n) => n !== state && n !== country && n !== village)
        ) ||
        cleanDistrictName(data.city) ||
        cleanDistrictName(data.locality);

      if (isValidDistrict(district, state, country)) {
        return {
          village: village || district,
          district,
          state,
          country,
          formatted: `${village ? `${village}, ` : ''}${district}, ${state}`
        };
      }
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode timed out or failed, trying OSM Nominatim...', err);
  }

  // Fallback 1: OpenStreetMap Nominatim with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12&addressdetails=1`,
      {
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const village = addr.village || addr.suburb || addr.town || addr.hamlet || '';
      const state = addr.state || 'Karnataka';
      const country = addr.country || 'India';
      const district = cleanDistrictName(
        addr.state_district || addr.county || addr.city_district || addr.city || addr.town
      );

      if (isValidDistrict(district, state, country)) {
        return {
          village: village || district,
          district,
          state,
          country,
          formatted: `${village ? `${village}, ` : ''}${district}, ${state}`
        };
      }
    }
  } catch (err) {
    console.warn('OSM Nominatim failed, falling back to centroid match', err);
  }

  // Fallback 2: Nearest agro district centroid lookup
  const nearest = findNearestDistrict(lat, lng);
  return {
    village: nearest.village,
    district: nearest.district,
    state: nearest.state,
    country: 'India',
    formatted: `${nearest.village}, ${nearest.district}, ${nearest.state}`
  };
}

/**
 * Load cached location from localStorage
 */
export function getStoredLocation(): LocationState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading stored location', e);
  }
  return null;
}

/**
 * Save location to localStorage
 */
export function setStoredLocation(loc: LocationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch (e) {
    console.error('Error saving location to storage', e);
  }
}

function requestPosition(options: PositionOptions): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        let msg = 'Failed to get location';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission denied by user';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location position unavailable';
        } else if (err.code === err.TIMEOUT) {
          msg = 'GPS location request timed out';
        }
        reject(new Error(msg));
      },
      options
    );
  });
}

/**
 * Requests browser GPS position with high accuracy and timeouts.
 * High-accuracy GPS often takes longer than 10 seconds indoors or on a
 * slow mobile connection, so a timeout / unavailable result is retried
 * once with lower accuracy instead of failing outright. A permission
 * denial is never retried. maximumAge is 0 so a "live" request does not
 * return a stale cached position.
 */
export async function getCurrentGPSCoordinates(): Promise<Coordinates> {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser');
  }

  try {
    return await requestPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('denied')) {
      throw err;
    }
    // Timeout or position unavailable: retry once, low accuracy, longer wait.
    return await requestPosition({
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 0
    });
  }
}
