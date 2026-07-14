import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

/**
 * Prayer-time computation via the `adhan` library (pure offline astronomy). Not a fiqh ruling —
 * it's calculation — so no scholar gate; the user picks a recognised calculation method + Asr madhab.
 */

export const PRAYER_METHODS = [
  'MuslimWorldLeague',
  'Egyptian',
  'Karachi',
  'UmmAlQura',
  'Dubai',
  'MoonsightingCommittee',
  'NorthAmerica',
  'Kuwait',
  'Qatar',
  'Singapore',
  'Tehran',
  'Turkey',
] as const;
export type PrayerMethodKey = (typeof PRAYER_METHODS)[number];

/** Asr timing: standard (Shafi'i/Maliki/Hanbali) vs later (Hanafi). */
export type AsrMadhab = 'shafi' | 'hanafi';

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export const PRAYER_ORDER: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export type PrayerTimesResult = Record<PrayerName, Date>;

export function computePrayerTimes(
  lat: number,
  lng: number,
  date: Date,
  method: PrayerMethodKey,
  asrMadhab: AsrMadhab
): PrayerTimesResult {
  const coords = new Coordinates(lat, lng);
  const params = CalculationMethod[method]();
  params.madhab = asrMadhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  const pt = new PrayerTimes(coords, date, params);
  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };
}

/** The next prayer at/after `now` from a day's times, or null if all have passed (→ tomorrow). */
export function nextPrayer(
  times: PrayerTimesResult,
  now: Date
): { name: PrayerName; time: Date } | null {
  for (const name of PRAYER_ORDER) {
    if (times[name].getTime() > now.getTime()) return { name, time: times[name] };
  }
  return null;
}
