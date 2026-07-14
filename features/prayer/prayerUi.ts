import { PRAYER_METHODS, type AsrMadhab, type PrayerMethodKey } from '@/core/prayer';
import type { Madhab } from '@/store/settingsStore';

// Preferred display order. Derived from core's PRAYER_METHODS so a method added to core can never be
// silently dropped from the picker — any not listed here are appended.
const PREFERRED_ORDER: PrayerMethodKey[] = [
  'MuslimWorldLeague',
  'NorthAmerica',
  'Karachi',
  'Egyptian',
  'UmmAlQura',
  'Dubai',
  'Kuwait',
  'Qatar',
  'Singapore',
  'Turkey',
  'Tehran',
  'MoonsightingCommittee',
];
export const PRAYER_METHOD_KEYS: PrayerMethodKey[] = [
  ...PREFERRED_ORDER.filter((m) => PRAYER_METHODS.includes(m)),
  ...PRAYER_METHODS.filter((m) => !PREFERRED_ORDER.includes(m)),
];

/**
 * Map the user's madhab to the Asr-timing convention (Hanafi = later Asr; the other three use the
 * standard/earlier time). This is an intentional, isolated 4→2 mapping for the `adhan` astronomy
 * library, NOT a fiqh ruling — prayer times aren't a fiqh-doc domain and have no RuleModule, so the
 * CLAUDE.md "no inline madhab branching" rule (which governs the fiqh calculators) doesn't apply here.
 */
export function asrMadhabForMadhab(madhab: Madhab): AsrMadhab {
  return madhab === 'hanafi' ? 'hanafi' : 'shafi';
}

/** 12-hour "h:mm AM/PM", computed manually to avoid Intl gaps on the JS engine. */
export function formatTime(d: Date): string {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

/** Compass heading (degrees from North) from a magnetometer sample. Approximate (no tilt comp). */
export function headingFromMagnetometer(x: number, y: number): number {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  angle = (angle + 360) % 360;
  return angle;
}
