// Qaḍāʾ (making up missed prayers & fasts) constants — docs/fiqh/qada.md Implementation Defaults.
// Provisional pending scholar review (ADR 0013).

/** Day conversions for turning a period into days (D1, approximate — user may enter days directly). */
export const DAYS_PER_YEAR = 365;
export const DAYS_PER_MONTH = 30;

/** The five daily obligatory (fard) prayers. Witr is added per madhab (see RuleModule). */
export const FARD_PER_DAY = 5;

export const QADA_MODES = ['prayers', 'fasts'] as const;
export type QadaMode = (typeof QADA_MODES)[number];

export const GENDERS = ['male', 'female'] as const;
export type Gender = (typeof GENDERS)[number];
