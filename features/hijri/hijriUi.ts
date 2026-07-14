import type { TFunction } from 'i18next';
import type { CalDate } from '@/core/hijri';

/** "27 Muharram 1448" — month name via i18n (hijri.month.1..12). */
export function formatHijri(t: TFunction, date: CalDate): string {
  return `${date.d} ${t(`hijri.month.${date.m}`)} ${date.y}`;
}

const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "13 July 2026" — locale-aware where the runtime supports it, else a plain fallback. */
export function formatGregorian(date: CalDate, locale = 'en'): string {
  try {
    return new Date(Date.UTC(date.y, date.m - 1, date.d)).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return `${date.d} ${EN_MONTHS[date.m - 1]} ${date.y}`;
  }
}

export function todayCalDate(): CalDate {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}
