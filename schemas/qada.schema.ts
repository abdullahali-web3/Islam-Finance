import { z } from 'zod';

/** Qaḍāʾ input schema (ADR 0001). Messages passed in translated (ADR 0009). */
export type QadaMessages = {
  amount: string;
  integer: string;
  minPeriod: string;
  minFasts: string;
};

export const DEFAULT_MESSAGES: QadaMessages = {
  amount: 'Enter a number',
  integer: 'Whole number',
  minPeriod: 'Enter a period to make up',
  minFasts: 'Enter the number of fasts',
};

function buildObject(m: QadaMessages) {
  const int = z.number({ message: m.amount }).int(m.integer).nonnegative(m.amount);
  return z.object({
    mode: z.enum(['prayers', 'fasts']),
    years: int.max(200, m.amount),
    months: int.max(10_000, m.amount),
    days: int.max(1_000_000, m.amount),
    gender: z.enum(['male', 'female']),
    // Average menstruation days per month (may be fractional, e.g. 6.5); excluded from prayer qaḍāʾ.
    menstruationDaysPerMonth: z.number({ message: m.amount }).nonnegative(m.amount).max(15, m.amount),
    missedFastDays: int.max(1_000_000, m.amount),
    delayedPastRamadan: z.enum(['yes', 'no']),
  });
}

export const qadaFields = buildObject(DEFAULT_MESSAGES);
export type QadaFormValues = z.infer<typeof qadaFields>;

export function makeQadaSchema(messages: QadaMessages = DEFAULT_MESSAGES) {
  return buildObject(messages).superRefine((v, ctx) => {
    if (v.mode === 'prayers' && v.years + v.months + v.days <= 0) {
      ctx.addIssue({ code: 'custom', path: ['years'], message: messages.minPeriod });
    }
    if (v.mode === 'fasts' && v.missedFastDays <= 0) {
      ctx.addIssue({ code: 'custom', path: ['missedFastDays'], message: messages.minFasts });
    }
  });
}

export const qadaDefaultValues: QadaFormValues = {
  mode: 'prayers',
  years: 0,
  months: 0,
  days: 0,
  gender: 'male',
  menstruationDaysPerMonth: 7,
  missedFastDays: 0,
  delayedPastRamadan: 'no',
};
