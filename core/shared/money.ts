// Money value type (ADR 0009). The audience is the global diaspora, so money is multi-currency
// from day one and MUST NOT be a bare `number`. This module is pure TypeScript with zero React
// Native imports (core/ rule) — every financial calculator depends on it.

/** Currencies the app supports at launch. Curated for the global-diaspora audience (ADR 0009). */
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' },
  { code: 'EUR', symbol: '€' },
  { code: 'PKR', symbol: '₨' },
  { code: 'INR', symbol: '₹' },
  { code: 'BDT', symbol: '৳' },
  { code: 'SAR', symbol: '﷼' },
  { code: 'AED', symbol: 'د.إ' },
  { code: 'CAD', symbol: 'CA$' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'MYR', symbol: 'RM' },
  { code: 'TRY', symbol: '₺' },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]['code'];

/** A monetary amount is always paired with its currency — never a lone number. */
export type Money = { amount: number; currency: CurrencyCode };

/** Thrown when two differing currencies are combined. Mixed currency is handled explicitly,
 *  never by silent addition (ADR 0009). */
export class MixedCurrencyError extends Error {
  constructor(a: CurrencyCode, b: CurrencyCode) {
    super(`Cannot combine ${a} and ${b} without an explicit conversion.`);
    this.name = 'MixedCurrencyError';
  }
}

const CURRENCY_CODES: ReadonlySet<string> = new Set(SUPPORTED_CURRENCIES.map((c) => c.code));

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCY_CODES.has(value);
}

/** Construct a Money. */
export function money(amount: number, currency: CurrencyCode): Money {
  return { amount, currency };
}

export function isSameCurrency(a: Money, b: Money): boolean {
  return a.currency === b.currency;
}

/** Add two Money of the same currency. Throws MixedCurrencyError on a mismatch — the caller must
 *  convert first (never silently). */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new MixedCurrencyError(a.currency, b.currency);
  return { amount: a.amount + b.amount, currency: a.currency };
}

/** Sum a non-empty list of same-currency Money. Throws on empty input or any currency mismatch. */
export function sumMoney(items: readonly Money[]): Money {
  if (items.length === 0) throw new Error('sumMoney requires at least one Money.');
  return items.reduce((acc, m) => addMoney(acc, m));
}

/**
 * Format Money for display. Formatting is a UI concern (ADR 0009), so `locale` is passed in from
 * the active i18n language rather than hardcoded. Uses Intl for locale-aware grouping/symbol;
 * falls back to a plain `CODE amount` string if the runtime's Intl lacks the data.
 */
export function formatMoney(value: Money, locale = 'en'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: value.currency,
      maximumFractionDigits: 2,
    }).format(value.amount);
  } catch {
    return `${value.currency} ${value.amount.toLocaleString(locale)}`;
  }
}
