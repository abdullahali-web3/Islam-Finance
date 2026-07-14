import { describe, it, expect } from '@jest/globals';
import { calculateFitrana, getRuleModule, ALL_RULE_MODULES, type FitranaInput } from '../index';

// Fixtures from docs/fiqh/fitrana.md "Worked Examples".
function base(overrides: Partial<FitranaInput> = {}): FitranaInput {
  return {
    people: 1,
    currency: 'USD',
    method: 'perPerson',
    perPersonAmount: 0,
    staple: 'dates',
    pricePerKg: 0,
    ...overrides,
  };
}

describe('calculateFitrana — worked examples', () => {
  it('1. by per-person amount', () => {
    const r = calculateFitrana(base({ people: 5, perPersonAmount: 10 }), getRuleModule('shafii'));
    expect(r.total).toEqual({ amount: 50, currency: 'USD' });
    expect(r.perPerson).toEqual({ amount: 10, currency: 'USD' });
  });

  it('2. by staple, non-Hanafi dates (full ṣāʿ)', () => {
    const r = calculateFitrana(
      base({ people: 4, method: 'byStaple', staple: 'dates', pricePerKg: 4 }),
      getRuleModule('shafii')
    );
    expect(r.perPerson).toEqual({ amount: 10, currency: 'USD' });
    expect(r.total).toEqual({ amount: 40, currency: 'USD' });
  });

  it('3. by staple, Hanafi wheat (half ṣāʿ)', () => {
    const r = calculateFitrana(
      base({ people: 4, method: 'byStaple', staple: 'wheat', pricePerKg: 2 }),
      getRuleModule('hanafi')
    );
    expect(r.perPerson).toEqual({ amount: 2.5, currency: 'USD' });
    expect(r.total).toEqual({ amount: 10, currency: 'USD' });
  });

  it('4. Hanafi dates → still a full ṣāʿ (half only applies to wheat)', () => {
    const r = calculateFitrana(
      base({ people: 2, method: 'byStaple', staple: 'dates', pricePerKg: 4 }),
      getRuleModule('hanafi')
    );
    expect(r.total).toEqual({ amount: 20, currency: 'USD' });
  });

  it('has all four schools', () => {
    expect(new Set(ALL_RULE_MODULES.map((m) => m.school))).toEqual(
      new Set(['hanafi', 'shafii', 'maliki', 'hanbali'])
    );
  });
});
