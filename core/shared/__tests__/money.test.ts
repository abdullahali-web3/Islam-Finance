import { describe, it, expect } from '@jest/globals';
import {
  money,
  addMoney,
  sumMoney,
  isSameCurrency,
  isCurrencyCode,
  formatMoney,
  MixedCurrencyError,
} from '../money';

describe('money value type', () => {
  it('constructs a Money', () => {
    expect(money(100, 'USD')).toEqual({ amount: 100, currency: 'USD' });
  });

  it('adds same-currency amounts', () => {
    expect(addMoney(money(100, 'USD'), money(50, 'USD'))).toEqual({ amount: 150, currency: 'USD' });
  });

  it('refuses to add differing currencies (never silent)', () => {
    expect(() => addMoney(money(100, 'USD'), money(50, 'GBP'))).toThrow(MixedCurrencyError);
  });

  it('sums a list of same-currency Money', () => {
    expect(sumMoney([money(10, 'GBP'), money(20, 'GBP'), money(5, 'GBP')])).toEqual({
      amount: 35,
      currency: 'GBP',
    });
  });

  it('throws summing an empty list', () => {
    expect(() => sumMoney([])).toThrow();
  });

  it('throws summing mixed currencies', () => {
    expect(() => sumMoney([money(10, 'USD'), money(20, 'PKR')])).toThrow(MixedCurrencyError);
  });

  it('detects same currency', () => {
    expect(isSameCurrency(money(1, 'EUR'), money(2, 'EUR'))).toBe(true);
    expect(isSameCurrency(money(1, 'EUR'), money(2, 'USD'))).toBe(false);
  });

  it('narrows valid/invalid currency codes', () => {
    expect(isCurrencyCode('USD')).toBe(true);
    expect(isCurrencyCode('ZZZ')).toBe(false);
  });

  it('formats Money via Intl for the given locale', () => {
    const formatted = formatMoney(money(1234.5, 'USD'), 'en-US');
    // Intl output varies by environment; assert the essential parts are present.
    expect(formatted).toContain('1,234.5');
    expect(formatted).toMatch(/\$|USD/);
  });
});
