import { describe, it, expect } from 'vitest';
import { calculateDistanceKm } from '../utils/geoUtils';

describe('Geospatial Distance Utilities', () => {
  it('calculates distance between Tellapur and Shankarpally', () => {
    const tellapur = { lat: 17.4612, lng: 78.2984 };
    const shankarpally = { lat: 17.4475, lng: 78.1321 };
    const distance = calculateDistanceKm(tellapur, shankarpally);
    expect(distance).toBeGreaterThan(15);
    expect(distance).toBeLessThan(25);
  });
});
