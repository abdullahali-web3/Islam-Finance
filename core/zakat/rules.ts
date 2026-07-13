import { money, type Money, type CurrencyCode } from '@/core/shared';
import { GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS, ZAKAT_RATE } from './constants';
import type { NisabBasis, ZakatRuleModule } from './madhab/types';

/**
 * Zakat calculation engine (docs/fiqh/zakat.md, Core Formulas + Implementation Defaults). Pure TS,
 * zero React Native imports. All amounts are in a single currency (the user's default — mixed
 * multi-currency is deferred, zakat.md V1 scope); the engine returns `Money` so the UI only formats.
 */

/** Raw numeric inputs (all in `currency`), plus the settings-derived basis/haul/currency. */
export type ZakatInput = {
  /** Cash, savings, bank balances. */
  cash: number;
  /** Personal debt due within the coming lunar year (D5) — deducted from total zakatable wealth. */
  personalDebtsDue: number;
  /** Gold held as investment/bullion (always zakatable). */
  goldGramsInvestment: number;
  /** Gold held as personal-use worn jewelry (madhab-dependent, D6). */
  goldGramsJewelry: number;
  silverGramsInvestment: number;
  silverGramsJewelry: number;
  goldPricePerGram: number;
  silverPricePerGram: number;
  business: {
    inventoryValue: number;
    cash: number;
    receivablesDue: number;
    liabilitiesDue: number;
  };
  /** Has a full lunar year passed since wealth reached nisab? (V1 user-declared, D8). */
  haulComplete: boolean;
  /** Which metal threshold to test nisab against (user setting, D3). */
  nisabBasis: NisabBasis;
  currency: CurrencyCode;
};

export type ZakatBreakdown = {
  cash: Money;
  goldValue: Money;
  silverValue: Money;
  businessBase: Money;
  debtsDeducted: Money;
  totalZakatableWealth: Money;
  nisabValue: Money;
  meetsNisab: boolean;
};

export type ZakatResult = {
  zakatDue: Money;
  breakdown: ZakatBreakdown;
  /** The rate applied (2.5%). */
  rate: number;
  aboveNisab: boolean;
  haulComplete: boolean;
};

/** Nisab value in the given currency = threshold grams for the chosen basis × that metal's price. */
export function resolveNisabValue(
  basis: NisabBasis,
  goldPricePerGram: number,
  silverPricePerGram: number
): number {
  return basis === 'gold'
    ? GOLD_NISAB_GRAMS * goldPricePerGram
    : SILVER_NISAB_GRAMS * silverPricePerGram;
}

export function calculateZakat(input: ZakatInput, rule: ZakatRuleModule): ZakatResult {
  const c = input.currency;

  // Jewelry counts toward zakatable metal only when the selected madhab taxes personal-use jewelry.
  const zakatableGoldGrams =
    input.goldGramsInvestment + (rule.personalJewelryZakatable ? input.goldGramsJewelry : 0);
  const zakatableSilverGrams =
    input.silverGramsInvestment + (rule.personalJewelryZakatable ? input.silverGramsJewelry : 0);

  const goldValue = zakatableGoldGrams * input.goldPricePerGram;
  const silverValue = zakatableSilverGrams * input.silverPricePerGram;

  // Business base nets currently-due receivables/liabilities only (D9).
  const businessBase =
    input.business.inventoryValue +
    input.business.cash +
    input.business.receivablesDue -
    input.business.liabilitiesDue;

  const grossWealth = input.cash + goldValue + silverValue + businessBase;
  const totalZakatableWealth = grossWealth - input.personalDebtsDue;

  const nisabValue = resolveNisabValue(
    input.nisabBasis,
    input.goldPricePerGram,
    input.silverPricePerGram
  );

  const meetsNisab = totalZakatableWealth >= nisabValue;
  const zakatDue = meetsNisab && input.haulComplete ? totalZakatableWealth * ZAKAT_RATE : 0;

  return {
    zakatDue: money(zakatDue, c),
    breakdown: {
      cash: money(input.cash, c),
      goldValue: money(goldValue, c),
      silverValue: money(silverValue, c),
      businessBase: money(businessBase, c),
      debtsDeducted: money(input.personalDebtsDue, c),
      totalZakatableWealth: money(totalZakatableWealth, c),
      nisabValue: money(nisabValue, c),
      meetsNisab,
    },
    rate: ZAKAT_RATE,
    aboveNisab: meetsNisab,
    haulComplete: input.haulComplete,
  };
}
