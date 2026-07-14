// Fitrana constants (docs/fiqh/fitrana.md Implementation Defaults). Provisional pending scholar
// review (ADR 0013).

/** Weight of one ṣāʿ in kilograms (D1). Approximate — sources give ~2.0–3.0 kg; flagged. */
export const SA_KG = 2.5;

export const STAPLES = ['dates', 'barley', 'raisins', 'wheat', 'rice'] as const;
export type Staple = (typeof STAPLES)[number];
