import { describe, it, expect } from '@jest/globals';
import { parseMetalPrices, isStale } from '../metalPrices';

describe('parseMetalPrices', () => {
  it('parses a well-formed proxy payload', () => {
    const parsed = parseMetalPrices(
      { goldPerGram: 65.4, silverPerGram: 0.82, asOf: '2026-07-13T00:00:00Z' },
      'USD'
    );
    expect(parsed).toEqual({
      goldPerGram: 65.4,
      silverPerGram: 0.82,
      currency: 'USD',
      asOf: '2026-07-13T00:00:00Z',
    });
  });

  it('defaults asOf when missing', () => {
    const parsed = parseMetalPrices({ goldPerGram: 65, silverPerGram: 0.8 }, 'GBP');
    expect(parsed?.asOf).toBeTruthy();
  });

  it('rejects non-positive or non-numeric prices', () => {
    expect(parseMetalPrices({ goldPerGram: 0, silverPerGram: 0.8 }, 'USD')).toBeNull();
    expect(parseMetalPrices({ goldPerGram: -1, silverPerGram: 0.8 }, 'USD')).toBeNull();
    expect(parseMetalPrices({ goldPerGram: 'x', silverPerGram: 0.8 }, 'USD')).toBeNull();
    expect(parseMetalPrices({ silverPerGram: 0.8 }, 'USD')).toBeNull();
  });

  it('rejects non-object input', () => {
    expect(parseMetalPrices(null, 'USD')).toBeNull();
    expect(parseMetalPrices('nope', 'USD')).toBeNull();
  });
});

describe('isStale', () => {
  const prices = {
    goldPerGram: 65,
    silverPerGram: 0.8,
    currency: 'USD' as const,
    asOf: '2026-07-13T00:00:00Z',
  };
  const dayMs = 24 * 60 * 60 * 1000;

  it('is fresh within the window', () => {
    const now = new Date('2026-07-13T06:00:00Z').getTime();
    expect(isStale(prices, dayMs, now)).toBe(false);
  });

  it('is stale past the window', () => {
    const now = new Date('2026-07-15T00:00:00Z').getTime();
    expect(isStale(prices, dayMs, now)).toBe(true);
  });

  it('treats an unparseable asOf as stale', () => {
    expect(isStale({ ...prices, asOf: 'not-a-date' }, dayMs)).toBe(true);
  });
});
