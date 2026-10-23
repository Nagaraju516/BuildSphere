import { describe, it, expect } from 'vitest';
import {
  calculateCementRequirement,
  calculateSteelRequirement,
  calculateSandRequirement,
  estimateCostByTier,
} from '../utils/constructionMath';

describe('Construction Math Calculations', () => {
  it('correctly calculates cement requirement for 2000 sq.ft', () => {
    expect(calculateCementRequirement(2000)).toBe(840);
  });

  it('correctly calculates steel requirement for 2000 sq.ft', () => {
    expect(calculateSteelRequirement(2000)).toBe(7);
  });

  it('correctly calculates sand requirement for 1000 sq.ft', () => {
    expect(calculateSandRequirement(1000)).toBe(45);
  });

  it('correctly estimates cost by construction tier', () => {
    expect(estimateCostByTier(1000, 'standard')).toBe(1850000);
    expect(estimateCostByTier(1000, 'premium')).toBe(2300000);
  });
});
