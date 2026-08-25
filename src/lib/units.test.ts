import { fToC, cToF, formatTemperature, daysSince } from './units';

describe('units helpers', () => {
  test('converts fahrenheit to celsius', () => {
    expect(fToC(78)).toBe(25.6);
  });

  test('converts celsius to fahrenheit', () => {
    expect(cToF(26)).toBe(78.8);
  });

  test('formats temperature by unit', () => {
    expect(formatTemperature(78, 'fahrenheit')).toBe('78°F');
    expect(formatTemperature(78, 'celsius')).toBe('25.6°C');
  });

  test('daysSince handles missing values', () => {
    expect(daysSince(null)).toBeNull();
    expect(daysSince(undefined)).toBeNull();
  });
});
