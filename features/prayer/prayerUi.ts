import type { AsrMadhab, PrayerMethodKey } from '@/core/prayer';
import type { Madhab } from '@/store/settingsStore';

export const PRAYER_METHOD_KEYS: PrayerMethodKey[] = [
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

/** Asr timing follows the user's madhab (Hanafi = later Asr). */
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
