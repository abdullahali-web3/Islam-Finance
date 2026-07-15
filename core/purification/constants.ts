// Investment purification constants — docs/fiqh/purification.md. Provisional (ADR 0013).
// Non-madhab (madhab_dependent: false) — a contemporary/AAOIFI matter, so no madhab RuleModule.

export const PURIFICATION_METHODS = ['byDividend', 'perShare'] as const;
export type PurificationMethod = (typeof PURIFICATION_METHODS)[number];
