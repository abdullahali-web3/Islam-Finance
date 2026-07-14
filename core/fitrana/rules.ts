import { money, type Money, type CurrencyCode } from '@/core/shared';
import { SA_KG, type Staple } from './constants';
import type { FitranaRuleModule } from './madhab/types';

/**
 * Zakat al-Fitr engine (docs/fiqh/fitrana.md). Pure TS. Either takes a per-person amount directly
 * (the common case — the user's mosque/council announces it) or estimates it from a staple food's
 * price × one ṣāʿ (half ṣāʿ for Hanafi wheat, D2). Returns Money.
 */

export type FitranaMethod = 'perPerson' | 'byStaple';

export type FitranaInput = {
  people: number;
  currency: CurrencyCode;
  method: FitranaMethod;
  /** Used when method === 'perPerson'. */
  perPersonAmount: number;
  /** Used when method === 'byStaple'. */
  staple: Staple;
  pricePerKg: number;
};

export type FitranaResult = {
  perPerson: Money;
  total: Money;
  people: number;
  /** Kilograms of staple used per person (byStaple only; 0 for perPerson). */
  kgPerPerson: number;
};

/** ½ ṣāʿ for Hanafi + wheat/flour, else a full ṣāʿ (D2). */
function saMultiplier(rule: FitranaRuleModule, staple: Staple): number {
  return rule.wheatIsHalfSa && staple === 'wheat' ? 0.5 : 1;
}

export function calculateFitrana(input: FitranaInput, rule: FitranaRuleModule): FitranaResult {
  const c = input.currency;
  let perPerson: number;
  let kgPerPerson = 0;

  if (input.method === 'perPerson') {
    perPerson = input.perPersonAmount;
  } else {
    kgPerPerson = saMultiplier(rule, input.staple) * SA_KG;
    perPerson = kgPerPerson * input.pricePerKg;
  }

  const round2 = (x: number) => Math.round(x * 100) / 100;
  return {
    perPerson: money(round2(perPerson), c),
    total: money(round2(perPerson * input.people), c),
    people: input.people,
    kgPerPerson,
  };
}
