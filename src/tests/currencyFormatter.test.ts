import { describe, it, expect } from 'vitest';
import { formatIndianRupees } from '../utils/currencyFormatter';

describe('Indian Currency Formatter', () => {
  it('formats compact Lakhs correctly', () => {
    expect(formatIndianRupees(9000000, true)).toContain('90.00 L');
  });

  it('formats compact Crores correctly', () => {
    expect(formatIndianRupees(18000000, true)).toContain('1.80 Cr');
  });
});
