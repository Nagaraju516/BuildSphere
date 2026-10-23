import { describe, it, expect } from 'vitest';
import { calculateTaxBreakdown } from '../utils/invoiceGenerator';

describe('GST Invoice Calculations', () => {
  it('computes 9% CGST and 9% SGST accurately', () => {
    const { subtotal, cgst, sgst, grandTotal } = calculateTaxBreakdown(10000);
    expect(subtotal).toBe(10000);
    expect(cgst).toBe(900);
    expect(sgst).toBe(900);
    expect(grandTotal).toBe(11800);
  });
});
