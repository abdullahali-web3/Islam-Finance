import { describe, it, expect } from '@jest/globals';
import { isValidTimeOfDay, secondsUntil, isFuture } from '../notificationSchedule';

describe('notification schedule helpers', () => {
  it('accepts valid times of day', () => {
    expect(isValidTimeOfDay({ hour: 0, minute: 0 })).toBe(true);
    expect(isValidTimeOfDay({ hour: 23, minute: 59 })).toBe(true);
    expect(isValidTimeOfDay({ hour: 5, minute: 30 })).toBe(true);
  });

  it('rejects out-of-range or non-integer times', () => {
    expect(isValidTimeOfDay({ hour: 24, minute: 0 })).toBe(false);
    expect(isValidTimeOfDay({ hour: -1, minute: 0 })).toBe(false);
    expect(isValidTimeOfDay({ hour: 12, minute: 60 })).toBe(false);
    expect(isValidTimeOfDay({ hour: 12.5, minute: 0 })).toBe(false);
  });

  it('computes whole seconds until a future date, clamped at 0', () => {
    const now = new Date('2026-07-13T12:00:00Z');
    expect(secondsUntil(new Date('2026-07-13T12:01:00Z'), now)).toBe(60);
    expect(secondsUntil(new Date('2026-07-13T11:00:00Z'), now)).toBe(0);
  });

  it('detects future vs past dates', () => {
    const now = new Date('2026-07-13T12:00:00Z');
    expect(isFuture(new Date('2026-07-13T12:00:01Z'), now)).toBe(true);
    expect(isFuture(new Date('2026-07-13T12:00:00Z'), now)).toBe(false);
    expect(isFuture(new Date('2026-07-13T11:59:59Z'), now)).toBe(false);
  });
});
