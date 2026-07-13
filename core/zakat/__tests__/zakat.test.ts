import { describe, it, expect } from '@jest/globals';
import {
  calculateZakat,
  getRuleModule,
  resolveNisabValue,
  ALL_RULE_MODULES,
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  type ZakatInput,
} from '../index';

// Fixtures derived VERBATIM from docs/fiqh/zakat.md "Worked Examples" (the fiqh doc's numbers are
// the source of truth — these tests fail if the engine drifts from the researched rules). Prices are
// set so the stated nisab thresholds hold; the doc's expected zakat figures are asserted exactly.
function baseInput(overrides: Partial<ZakatInput> = {}): ZakatInput {
  return {
    cash: 0,
    personalDebtsDue: 0,
    goldGramsInvestment: 0,
    goldGramsJewelry: 0,
    silverGramsInvestment: 0,
    silverGramsJewelry: 0,
    goldPricePerGram: 0,
    silverPricePerGram: 1, // → silver nisab = 595 (well below the cash figures below)
    business: { inventoryValue: 0, cash: 0, receivablesDue: 0, liabilitiesDue: 0 },
    haulComplete: true,
    nisabBasis: 'silver',
    currency: 'USD',
    ...overrides,
  };
}

describe('calculateZakat — worked examples (zakat.md)', () => {
  it('1. cash, straightforward → $250', () => {
    const result = calculateZakat(baseInput({ cash: 10000 }), getRuleModule('hanafi'));
    expect(result.zakatDue).toEqual({ amount: 250, currency: 'USD' });
    expect(result.breakdown.meetsNisab).toBe(true);
  });

  it('2. cash with debt deduction → $175', () => {
    const result = calculateZakat(
      baseInput({ cash: 10000, personalDebtsDue: 3000 }),
      getRuleModule('hanafi')
    );
    expect(result.zakatDue).toEqual({ amount: 175, currency: 'USD' });
    expect(result.breakdown.totalZakatableWealth).toEqual({ amount: 7000, currency: 'USD' });
  });

  it('3. gold jewelry, Hanafi (zakatable) → $175', () => {
    const result = calculateZakat(
      baseInput({ goldGramsJewelry: 100, goldPricePerGram: 70 }),
      getRuleModule('hanafi')
    );
    expect(result.zakatDue).toEqual({ amount: 175, currency: 'USD' });
  });

  it("4. gold jewelry, Shafi'i (exempt) → $0", () => {
    const result = calculateZakat(
      baseInput({ goldGramsJewelry: 100, goldPricePerGram: 70 }),
      getRuleModule('shafii')
    );
    expect(result.zakatDue).toEqual({ amount: 0, currency: 'USD' });
    expect(result.breakdown.goldValue).toEqual({ amount: 0, currency: 'USD' });
  });

  it('5. business inventory → $1,175', () => {
    const result = calculateZakat(
      baseInput({
        business: {
          inventoryValue: 50000,
          cash: 5000,
          receivablesDue: 2000,
          liabilitiesDue: 10000,
        },
      }),
      getRuleModule('hanafi')
    );
    expect(result.zakatDue).toEqual({ amount: 1175, currency: 'USD' });
    expect(result.breakdown.businessBase).toEqual({ amount: 47000, currency: 'USD' });
  });

  it('6. below nisab → $0', () => {
    // Silver nisab here = 595 (price 1 × 595g); $400 cash is below it.
    const result = calculateZakat(baseInput({ cash: 400 }), getRuleModule('hanafi'));
    expect(result.zakatDue).toEqual({ amount: 0, currency: 'USD' });
    expect(result.breakdown.meetsNisab).toBe(false);
  });
});

describe('calculateZakat — gates', () => {
  it('is $0 when above nisab but haul not complete', () => {
    const result = calculateZakat(
      baseInput({ cash: 10000, haulComplete: false }),
      getRuleModule('hanafi')
    );
    expect(result.aboveNisab).toBe(true);
    expect(result.zakatDue).toEqual({ amount: 0, currency: 'USD' });
  });

  it('honors the gold nisab basis', () => {
    // Gold basis: nisab = 87.48g × $70 = $6,123.60; $5,000 cash is below it → $0.
    const result = calculateZakat(
      baseInput({ cash: 5000, goldPricePerGram: 70, nisabBasis: 'gold' }),
      getRuleModule('hanafi')
    );
    expect(result.breakdown.meetsNisab).toBe(false);
    expect(result.zakatDue).toEqual({ amount: 0, currency: 'USD' });
  });
});

describe('resolveNisabValue', () => {
  it('uses the correct gram constant per basis', () => {
    expect(resolveNisabValue('gold', 70, 1)).toBeCloseTo(GOLD_NISAB_GRAMS * 70, 6);
    expect(resolveNisabValue('silver', 70, 1)).toBeCloseTo(SILVER_NISAB_GRAMS * 1, 6);
  });
});

describe('madhab rule modules (ADR 0003)', () => {
  it('has all four Sunni schools with unique names', () => {
    const schools = ALL_RULE_MODULES.map((m) => m.school);
    expect(new Set(schools)).toEqual(new Set(['hanafi', 'shafii', 'maliki', 'hanbali']));
  });

  it('only Hanafi taxes personal-use jewelry (D6)', () => {
    expect(getRuleModule('hanafi').personalJewelryZakatable).toBe(true);
    expect(getRuleModule('shafii').personalJewelryZakatable).toBe(false);
    expect(getRuleModule('maliki').personalJewelryZakatable).toBe(false);
    expect(getRuleModule('hanbali').personalJewelryZakatable).toBe(false);
  });

  it('records haul continuity model per school (D8)', () => {
    expect(getRuleModule('hanafi').haulContinuity).toBe('endpoints-only');
    expect(getRuleModule('shafii').haulContinuity).toBe('continuous');
  });
});
