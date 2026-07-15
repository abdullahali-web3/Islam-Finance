import { describe, it, expect } from '@jest/globals';
import { calculatePurification, type PurificationInput } from '../index';

// Fixtures are the numbered "Worked Examples" in docs/fiqh/purification.md, verbatim.
function base(overrides: Partial<PurificationInput> = {}): PurificationInput {
  return {
    method: 'byDividend',
    currency: 'USD',
    dividendAmount: 0,
    impurePercentage: 0,
    sharesHeld: 0,
    impureIncomePerShare: 0,
    ...overrides,
  };
}

describe('calculatePurification — worked examples', () => {
  const amount = (i: Partial<PurificationInput>) => calculatePurification(base(i)).purification;

  it('1. byDividend 1000 @ 3% → 30', () => {
    expect(amount({ dividendAmount: 1000, impurePercentage: 3 })).toEqual({ amount: 30, currency: 'USD' });
  });
  it('2. byDividend 1000 @ 5% → 50', () => {
    expect(amount({ dividendAmount: 1000, impurePercentage: 5 })).toEqual({ amount: 50, currency: 'USD' });
  });
  it('3. byDividend 2000 @ 2.5% → 50', () => {
    expect(amount({ dividendAmount: 2000, impurePercentage: 2.5 })).toEqual({ amount: 50, currency: 'USD' });
  });
  it('4. byDividend 1000 @ 0% → 0', () => {
    expect(amount({ dividendAmount: 1000, impurePercentage: 0 })).toEqual({ amount: 0, currency: 'USD' });
  });
  it('5. byDividend 1000 @ 100% → 1000', () => {
    expect(amount({ dividendAmount: 1000, impurePercentage: 100 })).toEqual({ amount: 1000, currency: 'USD' });
  });
  it('6. byDividend 333.33 @ 3% → 10.00 (rounding)', () => {
    expect(amount({ dividendAmount: 333.33, impurePercentage: 3 })).toEqual({ amount: 10, currency: 'USD' });
  });
  it('7. perShare 1000 shares @ 0.02 → 20', () => {
    expect(amount({ method: 'perShare', sharesHeld: 1000, impureIncomePerShare: 0.02 })).toEqual({
      amount: 20,
      currency: 'USD',
    });
  });
  it('8. perShare 500 shares @ 0.10 → 50', () => {
    expect(amount({ method: 'perShare', sharesHeld: 500, impureIncomePerShare: 0.1 })).toEqual({
      amount: 50,
      currency: 'USD',
    });
  });
  it('9. perShare 1234 shares @ 0.015 → 18.51', () => {
    expect(amount({ method: 'perShare', sharesHeld: 1234, impureIncomePerShare: 0.015 })).toEqual({
      amount: 18.51,
      currency: 'USD',
    });
  });

  it('echoes the method and inputs for the breakdown', () => {
    const r = calculatePurification(base({ dividendAmount: 1000, impurePercentage: 3 }));
    expect(r.method).toBe('byDividend');
    expect(r.dividendAmount).toBe(1000);
    expect(r.impurePercentage).toBe(3);
  });
});
