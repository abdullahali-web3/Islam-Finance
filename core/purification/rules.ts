import { money, type Money, type CurrencyCode } from '@/core/shared';
import type { PurificationMethod } from './constants';

/**
 * Investment purification engine (docs/fiqh/purification.md). Pure TS. Computes the impermissible
 * portion of investment income to give away (not Zakat, no reward), by either AAOIFI-aligned method:
 * dividend × non-compliant ratio, or shares × impure-income-per-share. No madhab dependence.
 */

export type PurificationInput = {
  method: PurificationMethod;
  currency: CurrencyCode;
  // byDividend
  dividendAmount: number;
  impurePercentage: number; // 0–100
  // perShare
  sharesHeld: number;
  impureIncomePerShare: number;
};

export type PurificationResult = {
  method: PurificationMethod;
  /** Amount to give away to purify the holding. */
  purification: Money;
  // echoed inputs (for the result breakdown)
  dividendAmount: number;
  impurePercentage: number;
  sharesHeld: number;
  impureIncomePerShare: number;
};

const round2 = (x: number) => Math.round(x * 100) / 100;

export function calculatePurification(input: PurificationInput): PurificationResult {
  const raw =
    input.method === 'byDividend'
      ? input.dividendAmount * (input.impurePercentage / 100)
      : input.sharesHeld * input.impureIncomePerShare;
  return {
    method: input.method,
    purification: money(round2(raw), input.currency),
    dividendAmount: input.dividendAmount,
    impurePercentage: input.impurePercentage,
    sharesHeld: input.sharesHeld,
    impureIncomePerShare: input.impureIncomePerShare,
  };
}
