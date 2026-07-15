import { money, type Money, type CurrencyCode } from '@/core/shared';
import { RATE, type Irrigation } from './constants';
import type { UshrRuleModule } from './madhab/types';

/**
 * ʿUshr (agricultural zakat) engine (docs/fiqh/ushr.md). Pure TS. Computes the ʿushr owed from the
 * harvest weight and irrigation method (10% natural / 5% artificial / 7.5% both), gated by the
 * 5-awsuq niṣāb for the majority (Hanafi has none). No ḥawl — due at harvest. Returns the ʿushr as a
 * produce weight (kg) plus, if a price is given, its cash value.
 */

export type UshrInput = {
  harvestKg: number;
  irrigation: Irrigation;
  /** Price per kg of the produce (0 = don't compute a cash value). */
  pricePerKg: number;
  currency: CurrencyCode;
};

export type UshrResult = {
  due: boolean;
  /** True when the madhab requires a niṣāb and the harvest is below it. */
  belowNisab: boolean;
  irrigation: Irrigation;
  /** 0.10 | 0.05 | 0.075. */
  rate: number;
  harvestKg: number;
  /** ʿUshr owed, as a weight of produce (0 when not due). */
  ushrKg: number;
  /** Cash value of the ʿushr owed (0 when not due or no price entered). */
  ushrValue: Money;
  nisabKg: number;
  requiresNisab: boolean;
};

const round2 = (x: number) => Math.round(x * 100) / 100;

export function calculateUshr(input: UshrInput, rule: UshrRuleModule): UshrResult {
  const { harvestKg, irrigation, pricePerKg, currency } = input;
  const rate = RATE[irrigation];
  const base = {
    irrigation,
    rate,
    harvestKg,
    nisabKg: rule.nisabKg,
    requiresNisab: rule.requiresNisab,
  };

  const belowNisab = rule.requiresNisab && harvestKg < rule.nisabKg;
  if (belowNisab || harvestKg <= 0) {
    return { ...base, due: false, belowNisab, ushrKg: 0, ushrValue: money(0, currency) };
  }

  const ushrKg = round2(harvestKg * rate);
  const ushrValue = money(round2(ushrKg * pricePerKg), currency);
  return { ...base, due: true, belowNisab: false, ushrKg, ushrValue };
}
