// Zakat threshold + rate constants. Every value traces to docs/fiqh/zakat.md's "Implementation
// Defaults (provisional)" table — provisional pending scholar review (ADR 0013), never invented.

/** Gold nisab weight in grams (D1: AAOIFI / classical 20 mithqal). */
export const GOLD_NISAB_GRAMS = 87.48;

/** Silver nisab weight in grams (D2: AAOIFI-aligned). */
export const SILVER_NISAB_GRAMS = 595;

/** Zakat rate for a lunar-year haul (D4: 2.5%). The 2.5772% Gregorian-year option is deferred. */
export const ZAKAT_RATE = 0.025;
