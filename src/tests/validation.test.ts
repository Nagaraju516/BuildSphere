import { describe, it, expect } from 'vitest';
import {
  isValidIndianPhone,
  isValidIndianPincode,
  isValidGSTIN,
} from '../utils/validation';

describe('Validation Helpers', () => {
  it('validates standard 10-digit Indian phone numbers', () => {
    expect(isValidIndianPhone('+91 98480 11223')).toBe(true);
    expect(isValidIndianPhone('9849155667')).toBe(true);
    expect(isValidIndianPhone('12345')).toBe(false);
  });

  it('validates 6-digit Indian postal codes', () => {
    expect(isValidIndianPincode('500081')).toBe(true);
    expect(isValidIndianPincode('560067')).toBe(true);
    expect(isValidIndianPincode('001122')).toBe(false);
  });

  it('validates Indian GSTIN format', () => {
    expect(isValidGSTIN('36AAACH7409R1ZZ')).toBe(true);
    expect(isValidGSTIN('INVALID_GST')).toBe(false);
  });
});
