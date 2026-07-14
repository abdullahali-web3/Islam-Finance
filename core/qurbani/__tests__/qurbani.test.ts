import { describe, it, expect } from '@jest/globals';
import { calculateQurbani, getRuleModule, ALL_RULE_MODULES, type QurbaniInput } from '../index';

// Fixtures from docs/fiqh/qurbani.md "Worked Examples".
function base(overrides: Partial<QurbaniInput> = {}): QurbaniInput {
  return {
    people: 1,
    currency: 'USD',
    animal: 'sheep',
    pricePerShare: 0,
    ownsNisab: false,
    resident: true,
    ...overrides,
  };
}

describe('calculateQurbani — worked examples', () => {
  it('1. Hanafi, owns nisab, 1 sheep → obligatory', () => {
    const r = calculateQurbani(base({ ownsNisab: true, pricePerShare: 150 }), getRuleModule('hanafi'));
    expect(r.status).toBe('obligatory');
    expect(r.shares).toBe(1);
    expect(r.animals).toBe(1);
    expect(r.cost).toEqual({ amount: 150, currency: 'USD' });
  });

  it('2. Shafiʿi, 1 sheep → recommended', () => {
    const r = calculateQurbani(base({ pricePerShare: 150 }), getRuleModule('shafii'));
    expect(r.status).toBe('recommended');
    expect(r.cost).toEqual({ amount: 150, currency: 'USD' });
  });

  it('3. Hanafi, owns nisab, 7 people, cow → 1 cow', () => {
    const r = calculateQurbani(
      base({ ownsNisab: true, people: 7, animal: 'cow', pricePerShare: 100 }),
      getRuleModule('hanafi')
    );
    expect(r.status).toBe('obligatory');
    expect(r.shares).toBe(7);
    expect(r.animals).toBe(1);
    expect(r.cost).toEqual({ amount: 700, currency: 'USD' });
  });

  it('4. 3 people, cow → 1 cow', () => {
    const r = calculateQurbani(
      base({ people: 3, animal: 'cow', pricePerShare: 100 }),
      getRuleModule('hanafi')
    );
    expect(r.animals).toBe(1);
    expect(r.cost).toEqual({ amount: 300, currency: 'USD' });
  });

  it('5. 10 people, cow → 2 cows', () => {
    const r = calculateQurbani(
      base({ people: 10, animal: 'cow', pricePerShare: 100 }),
      getRuleModule('hanafi')
    );
    expect(r.animals).toBe(2);
    expect(r.cost).toEqual({ amount: 1000, currency: 'USD' });
  });

  it('6. Hanafi, no nisab → recommended', () => {
    const r = calculateQurbani(base({ ownsNisab: false, pricePerShare: 150 }), getRuleModule('hanafi'));
    expect(r.status).toBe('recommended');
  });

  it('has all four schools', () => {
    expect(new Set(ALL_RULE_MODULES.map((m) => m.school))).toEqual(
      new Set(['hanafi', 'shafii', 'maliki', 'hanbali'])
    );
  });
});
