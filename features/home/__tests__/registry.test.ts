import { describe, it, expect } from '@jest/globals';
import { CALCULATORS, getCalculator } from '../registry';

describe('home registry (ADR 0006)', () => {
  it('has unique ids', () => {
    const ids = CALCULATORS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('routes are deep-linkable and match the id', () => {
    for (const c of CALCULATORS) {
      expect(c.route).toBe(`/calculator/${c.id}`);
    }
  });

  it('titleKey follows the home.card.* convention', () => {
    for (const c of CALCULATORS) {
      expect(c.titleKey.startsWith('home.card.')).toBe(true);
    }
  });

  it('looks up a calculator by id', () => {
    expect(getCalculator('zakat')?.id).toBe('zakat');
    expect(getCalculator('nope')).toBeUndefined();
  });
});
