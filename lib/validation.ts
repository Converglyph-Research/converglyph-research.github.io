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
  hanoi: { lat: 21.0285, lon: 105.8542, tz: 7.0 },
  warsaw: { lat: 52.2297, lon: 21.0122, tz: 1.0 },
  tokyo: { lat: 35.6762, lon: 139.6503, tz: 9.0 },
  "new york": { lat: 40.7128, lon: -74.0060, tz: -5.0 }
};

export function resolveCityCoordinates(cityInput: string): { lat: number; lon: number; tz: number } | null {
  const q = cityInput.toLowerCase().trim();
  for (const [key, coords] of Object.entries(CITY_GEO_FALLBACK)) {
    if (q.includes(key)) return coords;
  }
  return null;
}
