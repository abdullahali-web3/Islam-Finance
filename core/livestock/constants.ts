// Livestock (Zakāt al-Anʿām) constants — docs/fiqh/livestock.md Implementation Defaults.
// Provisional pending scholar review (ADR 0013).

export const SPECIES = ['camels', 'cattle', 'sheepGoats'] as const;
export type Species = (typeof SPECIES)[number];

/** Niṣāb (minimum head count) per species (D1). Below this, no zakat is due. */
export const NISAB: Record<Species, number> = {
  camels: 5,
  cattle: 30,
  sheepGoats: 40,
};

/**
 * Payment units: a sheep (shāh — the unit for ghanam and small camel herds), the four she-camel
 * ages, and the two bovine ages. Translations live in i18n (en/ur); this is the domain vocabulary.
 */
export const ANIMAL_TYPES = [
  'sheep', // shāh (sheep/goat)
  'bintMakhad', // ♀ camel, completed 1 yr
  'bintLabun', // ♀ camel, completed 2 yrs
  'hiqqah', // ♀ camel, completed 3 yrs
  'jadhaah', // ♀ camel, completed 4 yrs
  'tabi', // bovine, completed 1 yr
  'musinnah', // bovine, completed 2 yrs
] as const;
export type AnimalType = (typeof ANIMAL_TYPES)[number];
