import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidGregorianDate, isValidCoordinates, resolveCityCoordinates } from '../lib/validation.js';
import { deriveDomainScores } from '../lib/profile.js';

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

test('resolves known cities via fallback geocoder', () => {
  const ulm = resolveCityCoordinates('Ulm, Germany');
  assert.ok(ulm);
  assert.equal(ulm.tz, 1.0);
  assert.equal(resolveCityCoordinates('Atlantis City'), null);
});

test('derives personalized domain scores dynamically', () => {
  const scoresA = deriveDomainScores({
    western: { elements: { Fire: 5, Air: 4 }, midheaven: { degree: 14 } },
    numerology: { life_path_reduced: { number: 7 } },
    bazi: { elements_distribution: { Wood: 40, Fire: 30 } }
  });
  const scoresB = deriveDomainScores({
    western: { elements: { Earth: 6, Water: 5 }, midheaven: { degree: 2 } },
    numerology: { life_path_reduced: { number: 2 } },
    bazi: { elements_distribution: { Wood: 10, Metal: 50 } }
  });

  assert.notEqual(
    scoresA["Intellect & First Principles"].w,
    scoresB["Intellect & First Principles"].w
  );
});
