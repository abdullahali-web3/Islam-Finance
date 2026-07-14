import { describe, it, expect } from '@jest/globals';
import { qiblaBearing } from '../qibla';
import { computePrayerTimes, nextPrayer, PRAYER_ORDER, type PrayerTimesResult } from '../times';

describe('qiblaBearing', () => {
  // Known qibla directions (degrees from North), within a small tolerance.
  const cases: [string, number, number, number][] = [
    ['New York', 40.7128, -74.006, 58.5],
    ['London', 51.5074, -0.1278, 119],
    ['Jakarta', -6.2088, 106.8456, 295],
  ];
  it.each(cases)('%s points at ~%d° → %d', (_city, lat, lng, expected) => {
    expect(qiblaBearing(lat, lng)).toBeCloseTo(expected, -1); // within ~5°
  });
});

describe('computePrayerTimes', () => {
  it('returns the six times in chronological order on the requested day', () => {
    const date = new Date('2026-06-01T12:00:00Z');
    const times = computePrayerTimes(51.5074, -0.1278, date, 'MuslimWorldLeague', 'shafi');
    for (let i = 1; i < PRAYER_ORDER.length; i++) {
      expect(times[PRAYER_ORDER[i]].getTime()).toBeGreaterThan(times[PRAYER_ORDER[i - 1]].getTime());
    }
  });

  it('Hanafi Asr is later than Shafi Asr for the same day', () => {
    const date = new Date('2026-06-01T12:00:00Z');
    const shafi = computePrayerTimes(51.5074, -0.1278, date, 'MuslimWorldLeague', 'shafi');
    const hanafi = computePrayerTimes(51.5074, -0.1278, date, 'MuslimWorldLeague', 'hanafi');
    expect(hanafi.asr.getTime()).toBeGreaterThan(shafi.asr.getTime());
  });
});

describe('nextPrayer', () => {
  const times: PrayerTimesResult = {
    fajr: new Date('2026-06-01T03:00:00Z'),
    sunrise: new Date('2026-06-01T04:45:00Z'),
    dhuhr: new Date('2026-06-01T12:00:00Z'),
    asr: new Date('2026-06-01T16:00:00Z'),
    maghrib: new Date('2026-06-01T20:10:00Z'),
    isha: new Date('2026-06-01T21:45:00Z'),
  };

  it('finds the next upcoming prayer', () => {
    expect(nextPrayer(times, new Date('2026-06-01T13:00:00Z'))?.name).toBe('asr');
    expect(nextPrayer(times, new Date('2026-06-01T02:00:00Z'))?.name).toBe('fajr');
  });

  it('returns null when all have passed', () => {
    expect(nextPrayer(times, new Date('2026-06-01T23:00:00Z'))).toBeNull();
  });
});
