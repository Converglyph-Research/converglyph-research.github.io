/**
 * Validation utilities for complete Gregorian dates and coordinates
 */

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

export const CITY_GEO_FALLBACK: Record<string, { lat: number; lon: number; tz: number }> = {
  paris: { lat: 48.8566, lon: 2.3522, tz: 1.0 },
  london: { lat: 51.5074, lon: -0.1278, tz: 0.0 },
  berlin: { lat: 52.5200, lon: 13.4050, tz: 1.0 },
  ulm: { lat: 48.4011, lon: 9.9876, tz: 1.0 },
  vinci: { lat: 43.7874, lon: 10.9262, tz: 1.0 },
  florence: { lat: 43.7696, lon: 11.2558, tz: 1.0 },
  rome: { lat: 41.9028, lon: 12.4964, tz: 1.0 },
  warsaw: { lat: 52.2297, lon: 21.0122, tz: 1.0 },
  geneva: { lat: 46.2044, lon: 6.1432, tz: 1.0 },
  zurich: { lat: 47.3769, lon: 8.5417, tz: 1.0 },
  vienna: { lat: 48.2082, lon: 16.3738, tz: 1.0 },
  hanoi: { lat: 21.0285, lon: 105.8542, tz: 7.0 },
  "hà nội": { lat: 21.0285, lon: 105.8542, tz: 7.0 },
  "ho chi minh": { lat: 10.8231, lon: 106.6297, tz: 7.0 },
  "hồ chí minh": { lat: 10.8231, lon: 106.6297, tz: 7.0 },
  saigon: { lat: 10.8231, lon: 106.6297, tz: 7.0 },
  "sài gòn": { lat: 10.8231, lon: 106.6297, tz: 7.0 },
  "da nang": { lat: 16.0544, lon: 108.2022, tz: 7.0 },
  "đà nẵng": { lat: 16.0544, lon: 108.2022, tz: 7.0 },
  hue: { lat: 16.4637, lon: 107.5909, tz: 7.0 },
  "huế": { lat: 16.4637, lon: 107.5909, tz: 7.0 },
  "hai phong": { lat: 20.8449, lon: 106.6881, tz: 7.0 },
  "hải phòng": { lat: 20.8449, lon: 106.6881, tz: 7.0 },
  "can tho": { lat: 10.0452, lon: 105.7469, tz: 7.0 },
  "cần thơ": { lat: 10.0452, lon: 105.7469, tz: 7.0 },
  "nha trang": { lat: 12.2388, lon: 109.1967, tz: 7.0 },
  "da lat": { lat: 11.9404, lon: 108.4583, tz: 7.0 },
  "đà lạt": { lat: 11.9404, lon: 108.4583, tz: 7.0 },
  kyoto: { lat: 35.0116, lon: 135.7681, tz: 9.0 },
  seoul: { lat: 37.5665, lon: 126.9780, tz: 9.0 },
  beijing: { lat: 39.9042, lon: 116.4074, tz: 8.0 },
  shanghai: { lat: 31.2304, lon: 121.4737, tz: 8.0 },
  hongkong: { lat: 22.3193, lon: 114.1694, tz: 8.0 },
  singapore: { lat: 1.3521, lon: 103.8198, tz: 8.0 },
  bangkok: { lat: 13.7563, lon: 100.5018, tz: 7.0 },
  sydney: { lat: -33.8688, lon: 151.2093, tz: 10.0 },
  melbourne: { lat: -37.8136, lon: 144.9631, tz: 10.0 },
  "new york": { lat: 40.7128, lon: -74.0060, tz: -5.0 },
  boston: { lat: 42.3601, lon: -71.0589, tz: -5.0 },
  chicago: { lat: 41.8781, lon: -87.6298, tz: -6.0 },
  "san francisco": { lat: 37.7749, lon: -122.4194, tz: -8.0 },
  "los angeles": { lat: 34.0522, lon: -118.2437, tz: -8.0 },
  seattle: { lat: 47.6062, lon: -122.3321, tz: -8.0 },
  toronto: { lat: 43.6532, lon: -79.3832, tz: -5.0 },
  montreal: { lat: 45.5017, lon: -73.5673, tz: -5.0 }
};

export function resolveCityCoordinates(cityInput: string): { lat: number; lon: number; tz: number } | null {
  const q = cityInput.toLowerCase().trim();
  for (const [key, coords] of Object.entries(CITY_GEO_FALLBACK)) {
    if (q.includes(key)) return coords;
  }
  return null;
}
