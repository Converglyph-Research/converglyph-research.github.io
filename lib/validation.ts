/**
 * Validation utilities and global location search service
 */

export interface GeoLocationResult {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

export function isValidGregorianDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

export function isValidCoordinates(lat: number, lon: number): boolean {
  return (
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90.0 &&
    lat <= 90.0 &&
    lon >= -180.0 &&
    lon <= 180.0
  );
}

// Built-in offline fallback database with Country, City, Region
export const PRESET_GLOBAL_LOCATIONS: GeoLocationResult[] = [
  // Vietnam
  { name: "Hà Nội", country: "Việt Nam", admin1: "Thủ Đô", latitude: 21.0285, longitude: 105.8542, displayName: "Hà Nội, Việt Nam" },
  { name: "TP. Hồ Chí Minh", country: "Việt Nam", admin1: "Đông Nam Bộ", latitude: 10.8231, longitude: 106.6297, displayName: "TP. Hồ Chí Minh (Sài Gòn), Việt Nam" },
  { name: "Đà Nẵng", country: "Việt Nam", admin1: "Duyên Hải Nam Trung Bộ", latitude: 16.0544, longitude: 108.2022, displayName: "Đà Nẵng, Việt Nam" },
  { name: "Huế", country: "Việt Nam", admin1: "Thừa Thiên Huế", latitude: 16.4637, longitude: 107.5909, displayName: "Huế, Thừa Thiên Huế, Việt Nam" },
  { name: "Hải Phòng", country: "Việt Nam", admin1: "Đồng Bằng Sông Hồng", latitude: 20.8449, longitude: 106.6881, displayName: "Hải Phòng, Việt Nam" },
  { name: "Cần Thơ", country: "Việt Nam", admin1: "Đồng Bằng Sông Cửu Long", latitude: 10.0452, longitude: 105.7469, displayName: "Cần Thơ, Việt Nam" },
  { name: "Nha Trang", country: "Việt Nam", admin1: "Khánh Hòa", latitude: 12.2388, longitude: 109.1967, displayName: "Nha Trang, Khánh Hòa, Việt Nam" },
  { name: "Đà Lạt", country: "Việt Nam", admin1: "Lâm Đồng", latitude: 11.9404, longitude: 108.4583, displayName: "Đà Lạt, Lâm Đồng, Việt Nam" },
  { name: "Vũng Tàu", country: "Việt Nam", admin1: "Bà Rịa - Vũng Tàu", latitude: 10.3460, longitude: 107.0843, displayName: "Vũng Tàu, Việt Nam" },
  { name: "Quy Nhơn", country: "Việt Nam", admin1: "Bình Định", latitude: 13.7820, longitude: 109.2197, displayName: "Quy Nhơn, Bình Định, Việt Nam" },
  { name: "Quảng Ninh (Hạ Long)", country: "Việt Nam", admin1: "Quảng Ninh", latitude: 20.9505, longitude: 107.0734, displayName: "Hạ Long, Quảng Ninh, Việt Nam" },
  { name: "Buôn Ma Thuột", country: "Việt Nam", admin1: "Đắk Lắk", latitude: 12.6667, longitude: 108.0500, displayName: "Buôn Ma Thuột, Đắk Lắk, Việt Nam" },

  // International
  { name: "Ulm", country: "Germany", admin1: "Baden-Württemberg", latitude: 48.4011, longitude: 9.9876, displayName: "Ulm, Baden-Württemberg, Germany" },
  { name: "Vinci", country: "Italy", admin1: "Tuscany", latitude: 43.7874, longitude: 10.9262, displayName: "Vinci, Tuscany, Italy" },
  { name: "Warsaw", country: "Poland", admin1: "Masovia", latitude: 52.2297, longitude: 21.0122, displayName: "Warsaw, Poland" },
  { name: "Paris", country: "France", admin1: "Île-de-France", latitude: 48.8566, longitude: 2.3522, displayName: "Paris, France" },
  { name: "London", country: "United Kingdom", admin1: "England", latitude: 51.5074, longitude: -0.1278, displayName: "London, England, United Kingdom" },
  { name: "Berlin", country: "Germany", admin1: "Berlin", latitude: 52.5200, longitude: 13.4050, displayName: "Berlin, Germany" },
  { name: "Rome", country: "Italy", admin1: "Lazio", latitude: 41.9028, longitude: 12.4964, displayName: "Rome, Lazio, Italy" },
  { name: "Florence", country: "Italy", admin1: "Tuscany", latitude: 43.7696, longitude: 11.2558, displayName: "Florence, Tuscany, Italy" },
  { name: "Geneva", country: "Switzerland", admin1: "Geneva", latitude: 46.2044, longitude: 6.1432, displayName: "Geneva, Switzerland" },
  { name: "Zurich", country: "Switzerland", admin1: "Zurich", latitude: 47.3769, longitude: 8.5417, displayName: "Zurich, Switzerland" },
  { name: "Vienna", country: "Austria", admin1: "Vienna", latitude: 48.2082, longitude: 16.3738, displayName: "Vienna, Austria" },
  { name: "Tokyo", country: "Japan", admin1: "Tokyo", latitude: 35.6762, longitude: 139.6503, displayName: "Tokyo, Japan" },
  { name: "Kyoto", country: "Japan", admin1: "Kyoto", latitude: 35.0116, longitude: 135.7681, displayName: "Kyoto, Japan" },
  { name: "Seoul", country: "South Korea", admin1: "Seoul", latitude: 37.5665, longitude: 126.9780, displayName: "Seoul, South Korea" },
  { name: "Beijing", country: "China", admin1: "Beijing", latitude: 39.9042, longitude: 116.4074, displayName: "Beijing, China" },
  { name: "Shanghai", country: "China", admin1: "Shanghai", latitude: 31.2304, longitude: 121.4737, displayName: "Shanghai, China" },
  { name: "Hong Kong", country: "China", admin1: "Hong Kong", latitude: 22.3193, longitude: 114.1694, displayName: "Hong Kong, China" },
  { name: "Singapore", country: "Singapore", admin1: "Singapore", latitude: 1.3521, longitude: 103.8198, displayName: "Singapore, Singapore" },
  { name: "Bangkok", country: "Thailand", admin1: "Bangkok", latitude: 13.7563, longitude: 100.5018, displayName: "Bangkok, Thailand" },
  { name: "Sydney", country: "Australia", admin1: "New South Wales", latitude: -33.8688, longitude: 151.2093, displayName: "Sydney, New South Wales, Australia" },
  { name: "Melbourne", country: "Australia", admin1: "Victoria", latitude: -37.8136, longitude: 144.9631, displayName: "Melbourne, Victoria, Australia" },
  { name: "New York", country: "United States", admin1: "New York", latitude: 40.7128, longitude: -74.0060, displayName: "New York, NY, United States" },
  { name: "San Francisco", country: "United States", admin1: "California", latitude: 37.7749, longitude: -122.4194, displayName: "San Francisco, CA, United States" },
  { name: "Los Angeles", country: "United States", admin1: "California", latitude: 34.0522, longitude: -118.2437, displayName: "Los Angeles, CA, United States" },
  { name: "Chicago", country: "United States", admin1: "Illinois", latitude: 41.8781, longitude: -87.6298, displayName: "Chicago, IL, United States" },
  { name: "Seattle", country: "United States", admin1: "Washington", latitude: 47.6062, longitude: -122.3321, displayName: "Seattle, WA, United States" },
  { name: "Boston", country: "United States", admin1: "Massachusetts", latitude: 42.3601, longitude: -71.0589, displayName: "Boston, MA, United States" },
  { name: "Toronto", country: "Canada", admin1: "Ontario", latitude: 43.6532, longitude: -79.3832, displayName: "Toronto, Ontario, Canada" }
];

/**
 * Live Global Typeahead Search:
 * Queries Open-Meteo Geocoding API with instant fallback to regex on preset locations.
 */
export async function searchGlobalLocations(query: string): Promise<GeoLocationResult[]> {
  const cleanQ = query.trim();
  if (!cleanQ || cleanQ.length < 2) return [];

  // Filter local presets first via regex
  const safeRegexStr = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(safeRegexStr, 'i');

  const localMatches = PRESET_GLOBAL_LOCATIONS.filter(item =>
    regex.test(item.name) ||
    regex.test(item.country) ||
    (item.admin1 && regex.test(item.admin1)) ||
    regex.test(item.displayName)
  );

  // If online, fetch live global locations from Open-Meteo Geocoding API
  try {
    const encoded = encodeURIComponent(cleanQ);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=8&language=en&format=json`;
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json();
      const results: GeoLocationResult[] = (data.results || []).map((r: any) => {
        const parts = [r.name, r.admin1, r.country].filter(Boolean);
        return {
          name: r.name,
          country: r.country || '',
          admin1: r.admin1 || '',
          latitude: Number(r.latitude.toFixed(4)),
          longitude: Number(r.longitude.toFixed(4)),
          displayName: parts.join(', ')
        };
      });

      if (results.length > 0) {
        // Merge without duplicates
        const seen = new Set<string>();
        const combined: GeoLocationResult[] = [];
        for (const item of [...results, ...localMatches]) {
          const key = `${item.latitude.toFixed(2)},${item.longitude.toFixed(2)}`;
          if (!seen.has(key)) {
            seen.add(key);
            combined.push(item);
          }
        }
        return combined.slice(0, 10);
      }
    }
  } catch (err) {
    // Graceful fallback to local regex matches
  }

  return localMatches.slice(0, 8);
}

/**
 * Reverse Geocode: Convert exact GPS Latitude & Longitude into real "City, Region, Country"
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<string> {
  // Try BigDataCloud reverse geocoding API
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json();
      const city = data.city || data.locality || data.principalSubdivision;
      const country = data.countryName;
      if (city && country) {
        return `${city}, ${country}`;
      } else if (country) {
        return `${data.principalSubdivision ? data.principalSubdivision + ', ' : ''}${country}`;
      }
    }
  } catch {}

  // Fallback: check closest preset location
  let closest: GeoLocationResult | null = null;
  let minDist = Infinity;
  for (const loc of PRESET_GLOBAL_LOCATIONS) {
    const d = Math.hypot(loc.latitude - lat, loc.longitude - lon);
    if (d < minDist) {
      minDist = d;
      closest = loc;
    }
  }

  if (closest && minDist < 0.5) {
    return closest.displayName;
  }

  return `${lat >= 0 ? lat.toFixed(2) + '°N' : Math.abs(lat).toFixed(2) + '°S'}, ${lon >= 0 ? lon.toFixed(2) + '°E' : Math.abs(lon).toFixed(2) + '°W'}`;
}

export function resolveCityCoordinates(cityInput: string): { lat: number; lon: number; tz: number } | null {
  const q = cityInput.toLowerCase().trim();
  for (const item of PRESET_GLOBAL_LOCATIONS) {
    if (q.includes(item.name.toLowerCase()) || item.displayName.toLowerCase().includes(q)) {
      return { lat: item.latitude, lon: item.longitude, tz: item.country === 'Việt Nam' ? 7.0 : 0.0 };
    }
  }
  return null;
}
