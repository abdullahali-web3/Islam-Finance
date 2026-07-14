import { describe, it, expect } from '@jest/globals';
import { calculateExpiation, type FidyaInput } from '../index';

// Fixtures from docs/fiqh/fidya.md "Worked Examples".
function base(overrides: Partial<FidyaInput> = {}): FidyaInput {
  return { type: 'fidya', days: 0, perDayAmount: 0, currency: 'USD', ...overrides };
}

describe('calculateExpiation — worked examples', () => {
  it('1. Fidya, 30 missed fasts @ $5 → $150', () => {
    const r = calculateExpiation(base({ type: 'fidya', days: 30, perDayAmount: 5 }));
    expect(r.total).toEqual({ amount: 150, currency: 'USD' });
    expect(r.peopleFed).toBe(30);
  });

  it('2. Kaffarah, 1 broken fast @ $5 → $300 (feeds 60)', () => {
    const r = calculateExpiation(base({ type: 'kaffarah', days: 1, perDayAmount: 5 }));
    expect(r.total).toEqual({ amount: 300, currency: 'USD' });
    expect(r.peopleFed).toBe(60);
  });

  it('3. Kaffarah, 2 broken fasts @ $5 → $600 (feeds 120)', () => {
    const r = calculateExpiation(base({ type: 'kaffarah', days: 2, perDayAmount: 5 }));
    expect(r.total).toEqual({ amount: 600, currency: 'USD' });
    expect(r.peopleFed).toBe(120);
  });

  it('4. Fidya, 10 missed fasts @ $3 → $30', () => {
    const r = calculateExpiation(base({ type: 'fidya', days: 10, perDayAmount: 3 }));
    expect(r.total).toEqual({ amount: 30, currency: 'USD' });
  });
});
