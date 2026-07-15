import { DAYS_PER_YEAR, DAYS_PER_MONTH, FARD_PER_DAY, type QadaMode, type Gender } from './constants';
import type { QadaRuleModule } from './madhab/types';

/**
 * Qaḍāʾ engine (docs/fiqh/qada.md). Pure TS, no money. Counts obligatory worship owed. Two modes:
 * PRAYERS — total prayers over a period, excluding a woman's menstruation days, +Witr for Hanafi;
 * FASTS — Ramadan fasts to make up one-for-one, with a fidya-for-delay flag (majority, not Hanafi).
 */

export type QadaInput = {
  mode: QadaMode;
  // prayers mode
  years: number;
  months: number;
  days: number;
  gender: Gender;
  menstruationDaysPerMonth: number;
  // fasts mode
  missedFastDays: number;
  delayedPastRamadan: boolean;
};

export type PrayersResult = {
  mode: 'prayers';
  totalDays: number;
  /** Days excluded because of menstruation (0 for men); prayer-only exclusion. */
  menstruationDays: number;
  /** Days on which prayer was owed = totalDays − menstruationDays. */
  prayerDays: number;
  fardPerDay: number; // 5
  witrPerDay: number; // 0 (majority) | 1 (Hanafi)
  fardTotal: number;
  witrTotal: number;
  total: number; // fardTotal + witrTotal
  includesWitr: boolean;
};

export type FastsResult = {
  mode: 'fasts';
  fastsToMakeUp: number;
  /** True when the makeup was delayed past the next Ramadan and the madhab charges fidya for it. */
  fidyaDueForDelay: boolean;
};

export type QadaResult = PrayersResult | FastsResult;

function calcPrayers(input: QadaInput, rule: QadaRuleModule): PrayersResult {
  const totalDays = input.years * DAYS_PER_YEAR + input.months * DAYS_PER_MONTH + input.days;
  const menstruationDays =
    input.gender === 'female'
      ? Math.min(
          totalDays,
          Math.round((totalDays / DAYS_PER_MONTH) * input.menstruationDaysPerMonth)
        )
      : 0;
  const prayerDays = Math.max(0, totalDays - menstruationDays);
  const witrPerDay = rule.includesWitr ? 1 : 0;
  const fardTotal = prayerDays * FARD_PER_DAY;
  const witrTotal = prayerDays * witrPerDay;
  return {
    mode: 'prayers',
    totalDays,
    menstruationDays,
    prayerDays,
    fardPerDay: FARD_PER_DAY,
    witrPerDay,
    fardTotal,
    witrTotal,
    total: fardTotal + witrTotal,
    includesWitr: rule.includesWitr,
  };
}

function calcFasts(input: QadaInput, rule: QadaRuleModule): FastsResult {
  return {
    mode: 'fasts',
    fastsToMakeUp: input.missedFastDays,
    fidyaDueForDelay: input.delayedPastRamadan && rule.fidyaForDelayedFast,
  };
}

export function calculateQada(input: QadaInput, rule: QadaRuleModule): QadaResult {
  return input.mode === 'prayers' ? calcPrayers(input, rule) : calcFasts(input, rule);
}
