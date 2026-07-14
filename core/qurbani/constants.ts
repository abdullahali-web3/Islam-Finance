// Qurbani constants (docs/fiqh/qurbani.md D1).
export const ANIMALS = ['sheep', 'goat', 'cow', 'buffalo', 'camel'] as const;
export type Animal = (typeof ANIMALS)[number];

/** Shares per animal: sheep/goat = 1, cow/buffalo/camel = 7. */
export const SHARES_PER_ANIMAL: Record<Animal, number> = {
  sheep: 1,
  goat: 1,
  cow: 7,
  buffalo: 7,
  camel: 7,
};
