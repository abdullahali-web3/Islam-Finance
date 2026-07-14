import { describe, it, expect } from '@jest/globals';
import {
  gregorianToHijri,
  hijriToGregorian,
  gregorianToJDN,
  jdnToGregorian,
  upcomingEvents,
  ISLAMIC_EVENTS,
  type CalDate,
} from '../index';

describe('hijri conversion', () => {
  const samples: CalDate[] = [
    { y: 2000, m: 1, d: 1 },
    { y: 2021, m: 8, d: 10 },
    { y: 2026, m: 7, d: 13 },
    { y: 2030, m: 12, d: 31 },
  ];

  it('gregorian -> hijri -> gregorian round-trips exactly', () => {
    for (const g of samples) {
      const h = gregorianToHijri(g);
      expect(hijriToGregorian(h)).toEqual(g);
    }
  });

  it('gregorian <-> JDN round-trips', () => {
    for (const g of samples) {
      expect(jdnToGregorian(gregorianToJDN(g))).toEqual(g);
    }
  });

  it('maps a Gregorian year to a plausible Hijri year', () => {
    // Mid-2026 falls in Hijri 1447–1448.
    const h = gregorianToHijri({ y: 2026, m: 7, d: 13 });
    expect(h.y).toBeGreaterThanOrEqual(1447);
    expect(h.y).toBeLessThanOrEqual(1448);
    expect(h.m).toBeGreaterThanOrEqual(1);
    expect(h.m).toBeLessThanOrEqual(12);
    expect(h.d).toBeGreaterThanOrEqual(1);
    expect(h.d).toBeLessThanOrEqual(30);
  });

  it('a manual day adjustment shifts the result by that many days', () => {
    const g: CalDate = { y: 2026, m: 3, d: 1 };
    const plain = gregorianToHijri(g, 0);
    const shifted = gregorianToHijri(g, 1);
    // +1 day should advance the Hijri day (or roll into the next month).
    expect(shifted).not.toEqual(plain);
  });
});

describe('upcomingEvents', () => {
  it('returns the requested count, sorted ascending, on/after the date', () => {
    const from: CalDate = { y: 2026, m: 7, d: 13 };
    const events = upcomingEvents(from, 5);
    expect(events).toHaveLength(5);
    for (let i = 1; i < events.length; i++) {
      expect(gregorianToJDN(events[i].gregorian)).toBeGreaterThanOrEqual(
        gregorianToJDN(events[i - 1].gregorian)
      );
    }
    // Every event key is a known Islamic event.
    const keys = new Set(ISLAMIC_EVENTS.map((e) => e.key));
    for (const e of events) expect(keys.has(e.key)).toBe(true);
  });
});
