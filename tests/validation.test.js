import test from 'node:test';
import assert from 'node:assert/strict';

// Standalone test suite verifying exact validation & scoring rules
function isValidGregorianDate(year, month, day) {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

function isValidCoordinates(lat, lon) {
  return (
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90.0 &&
    lat <= 90.0 &&
    lon >= -180.0 &&
    lon <= 180.0
  );
}

test('validates complete Gregorian dates (catches Feb 31, leap years)', () => {
  assert.equal(isValidGregorianDate(1879, 3, 14), true);
  assert.equal(isValidGregorianDate(2024, 2, 29), true);
  assert.equal(isValidGregorianDate(2023, 2, 29), false);
  assert.equal(isValidGregorianDate(2026, 4, 31), false);
});

test('validates latitude and longitude ranges', () => {
  assert.equal(isValidCoordinates(48.4011, 9.9876), true);
  assert.equal(isValidCoordinates(95.0, 10.0), false);
  assert.equal(isValidCoordinates(48.0, 190.0), false);
});
