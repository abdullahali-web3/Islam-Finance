// Hijri <-> Gregorian conversion (tabular/"Kuwaiti" Islamic calendar via Julian Day Number). Pure
// TS, no fiqh ruling involved — it's arithmetic/astronomy, so no scholar gate. Algorithmic Hijri
// calendars are approximate vs actual moon-sighting (±1–2 days), so the UI exposes a manual day
// adjustment. Round-trip conversion is exact.

export type CalDate = { y: number; m: number; d: number };

const ISLAMIC_EPOCH = 1948440; // JDN of 1 Muharram 1 AH (civil epoch)

export function gregorianToJDN({ y, m, d }: CalDate): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

export function jdnToGregorian(jdn: number): CalDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const dd = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * dd) / 4);
  const mo = Math.floor((5 * e + 2) / 153);
  return {
    d: e - Math.floor((153 * mo + 2) / 5) + 1,
    m: mo + 3 - 12 * Math.floor(mo / 10),
    y: 100 * b + dd - 4800 + Math.floor(mo / 10),
  };
}

export function hijriToJDN({ y, m, d }: CalDate): number {
  return (
    d +
    Math.ceil(29.5 * (m - 1)) +
    (y - 1) * 354 +
    Math.floor((3 + 11 * y) / 30) +
    ISLAMIC_EPOCH -
    1
  );
}

export function jdnToHijri(jdn: number): CalDate {
  const y = Math.floor((30 * (jdn - ISLAMIC_EPOCH) + 10646) / 10631);
  const firstDayOfYear = hijriToJDN({ y, m: 1, d: 1 });
  const m = Math.min(12, Math.ceil((jdn - (29 + firstDayOfYear)) / 29.5) + 1);
  const d = jdn - hijriToJDN({ y, m, d: 1 }) + 1;
  return { y, m, d };
}

/** Convert a Gregorian calendar date to Hijri (optionally shifting by `adjustDays`). */
export function gregorianToHijri(date: CalDate, adjustDays = 0): CalDate {
  return jdnToHijri(gregorianToJDN(date) + adjustDays);
}

/** Convert a Hijri calendar date to Gregorian (reversing `adjustDays`). */
export function hijriToGregorian(date: CalDate, adjustDays = 0): CalDate {
  return jdnToGregorian(hijriToJDN(date) - adjustDays);
}

/** Days in a Hijri month (for validation/UI). */
export function hijriMonthLength(y: number, m: number): number {
  return hijriToJDN({ y, m: m === 12 ? 12 : m + 1, d: m === 12 ? 30 : 1 }) - hijriToJDN({ y, m, d: 1 }) || 29;
}

/** Fixed Hijri (month, day) of the key Islamic events. Keys map to i18n in the UI. */
export const ISLAMIC_EVENTS: { key: string; m: number; d: number }[] = [
  { key: 'newYear', m: 1, d: 1 },
  { key: 'ashura', m: 1, d: 10 },
  { key: 'mawlid', m: 3, d: 12 },
  { key: 'ramadanStart', m: 9, d: 1 },
  { key: 'laylatAlQadr', m: 9, d: 27 },
  { key: 'eidAlFitr', m: 10, d: 1 },
  { key: 'arafah', m: 12, d: 9 },
  { key: 'eidAlAdha', m: 12, d: 10 },
];

export type UpcomingEvent = { key: string; hijri: CalDate; gregorian: CalDate };

/** The next `count` Islamic events on/after `fromGregorian`, soonest first. */
export function upcomingEvents(fromGregorian: CalDate, count = 6, adjustDays = 0): UpcomingEvent[] {
  const fromJdn = gregorianToJDN(fromGregorian) + adjustDays;
  const currentHijri = jdnToHijri(fromJdn);
  const results: UpcomingEvent[] = [];
  // Scan this Hijri year and the next two to gather enough upcoming events.
  for (let y = currentHijri.y; y <= currentHijri.y + 2; y++) {
    for (const ev of ISLAMIC_EVENTS) {
      const jdn = hijriToJDN({ y, m: ev.m, d: ev.d });
      if (jdn >= fromJdn) {
        results.push({ key: ev.key, hijri: { y, m: ev.m, d: ev.d }, gregorian: jdnToGregorian(jdn - adjustDays) });
      }
    }
  }
  return results.sort((a, b) => gregorianToJDN(a.gregorian) - gregorianToJDN(b.gregorian)).slice(0, count);
}
