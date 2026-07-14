import { money, type Money, type CurrencyCode } from '@/core/shared';

/**
 * Fidya & Kaffarah engine (docs/fiqh/fidya.md). Pure TS, no madhab branching (the per-day feeding
 * amount is user-provided). Fidya feeds 1 poor person per missed fast; Kaffarah feeds 60 per broken
 * fast day. Returns Money.
 */

/** People fed per broken fast day for Kaffarah (D1). */
export const KAFFARAH_PEOPLE_PER_DAY = 60;

export type ExpiationType = 'fidya' | 'kaffarah';

export type FidyaInput = {
  type: ExpiationType;
  /** Missed fasts (fidya) or broken fasts (kaffarah). */
  days: number;
  /** Cash to feed one poor person for one day. */
  perDayAmount: number;
  currency: CurrencyCode;
};

export type FidyaResult = {
  type: ExpiationType;
  days: number;
  peopleFed: number;
  total: Money;
};

export function calculateExpiation(input: FidyaInput): FidyaResult {
  const multiplier = input.type === 'kaffarah' ? KAFFARAH_PEOPLE_PER_DAY : 1;
  const peopleFed = input.days * multiplier;
  const total = Math.round(peopleFed * input.perDayAmount * 100) / 100;
  return {
    type: input.type,
    days: input.days,
    peopleFed,
    total: money(total, input.currency),
  };
}
