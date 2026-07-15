// ʿUshr (agricultural zakat) constants — docs/fiqh/ushr.md Implementation Defaults.
// Provisional pending scholar review (ADR 0013).

/** Niṣāb = 5 awsuq = 300 ṣāʿ ≈ 653 kg of the staple crop (D1; kg figure flagged 612–653). */
export const NISAB_KG = 653;

export const IRRIGATION = ['natural', 'artificial', 'both'] as const;
export type Irrigation = (typeof IRRIGATION)[number];

/** Rate by irrigation (D3): natural 10%, artificial 5%, both 7.5% (¾ ʿushr). Agreed across madhabs. */
export const RATE: Record<Irrigation, number> = {
  natural: 0.1,
  artificial: 0.05,
  both: 0.075,
};
