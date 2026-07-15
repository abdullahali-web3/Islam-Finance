import { describe, it, expect } from '@jest/globals';
import { calculateUshr, getRuleModule, ALL_RULE_MODULES, type UshrInput } from '../index';

// Fixtures are the numbered "Worked Examples" in docs/fiqh/ushr.md, verbatim.
function base(overrides: Partial<UshrInput> = {}): UshrInput {
  return { harvestKg: 0, irrigation: 'natural', pricePerKg: 0, currency: 'USD', ...overrides };
}
const majority = getRuleModule('shafii');

describe('calculateUshr — worked examples', () => {
  it('1. 1000 kg natural, majority → 100 kg (10%)', () => {
    const r = calculateUshr(base({ harvestKg: 1000, irrigation: 'natural' }), majority);
    expect(r.due).toBe(true);
    expect(r.ushrKg).toBe(100);
  });
  it('2. 1000 kg artificial → 50 kg (5%)', () => {
    expect(calculateUshr(base({ harvestKg: 1000, irrigation: 'artificial' }), majority).ushrKg).toBe(50);
  });
  it('3. 1000 kg both → 75 kg (7.5%)', () => {
    expect(calculateUshr(base({ harvestKg: 1000, irrigation: 'both' }), majority).ushrKg).toBe(75);
  });
  it('4. 500 kg natural, majority → none (below niṣāb)', () => {
    const r = calculateUshr(base({ harvestKg: 500 }), majority);
    expect(r.due).toBe(false);
    expect(r.belowNisab).toBe(true);
  });
  it('5. 500 kg natural, Hanafi → 50 kg (no niṣāb)', () => {
    const r = calculateUshr(base({ harvestKg: 500 }), getRuleModule('hanafi'));
    expect(r.due).toBe(true);
    expect(r.ushrKg).toBe(50);
  });
  it('6. 653 kg natural, majority → exactly niṣāb → 65.3 kg', () => {
    const r = calculateUshr(base({ harvestKg: 653 }), majority);
    expect(r.due).toBe(true);
    expect(r.ushrKg).toBe(65.3);
  });
  it('7. 652 kg natural, majority → none (below niṣāb)', () => {
    expect(calculateUshr(base({ harvestKg: 652 }), majority).due).toBe(false);
  });
  it('8. 10 kg natural, Hanafi → 1 kg', () => {
    expect(calculateUshr(base({ harvestKg: 10 }), getRuleModule('hanafi')).ushrKg).toBe(1);
  });
  it('9. 1000 kg natural, majority, price 2 → value 200', () => {
    const r = calculateUshr(base({ harvestKg: 1000, pricePerKg: 2 }), majority);
    expect(r.ushrValue).toEqual({ amount: 200, currency: 'USD' });
  });
  it('10. 2000 kg artificial, majority, price 1.5 → value 150', () => {
    const r = calculateUshr(base({ harvestKg: 2000, irrigation: 'artificial', pricePerKg: 1.5 }), majority);
    expect(r.ushrKg).toBe(100);
    expect(r.ushrValue).toEqual({ amount: 150, currency: 'USD' });
  });
});

describe('calculateUshr — madhab & guards', () => {
  it('majority requires niṣāb; Hanafi does not', () => {
    expect(getRuleModule('shafii').requiresNisab).toBe(true);
    expect(getRuleModule('maliki').requiresNisab).toBe(true);
    expect(getRuleModule('hanbali').requiresNisab).toBe(true);
    expect(getRuleModule('hanafi').requiresNisab).toBe(false);
  });
  it('no cash value when no price entered', () => {
    const r = calculateUshr(base({ harvestKg: 1000 }), majority);
    expect(r.ushrValue).toEqual({ amount: 0, currency: 'USD' });
  });
  it('distinguishes "no harvest" from "below niṣāb" (Hanafi has no niṣāb)', () => {
    const r = calculateUshr(base({ harvestKg: 0 }), getRuleModule('hanafi'));
    expect(r.due).toBe(false);
    expect(r.belowNisab).toBe(false); // not a niṣāb failure — there's simply no harvest
  });
  it('has all four schools', () => {
    expect(new Set(ALL_RULE_MODULES.map((m) => m.school))).toEqual(
      new Set(['hanafi', 'shafii', 'maliki', 'hanbali'])
    );
  });
});
