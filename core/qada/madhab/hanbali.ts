import type { QadaRuleModule } from './types';

/** Hanbali: Witr is sunnah (not made up) → 5/day; fidya owed for a fast makeup delayed past Ramadan. */
export const hanbali: QadaRuleModule = {
  school: 'hanbali',
  includesWitr: false,
  fidyaForDelayedFast: true,
};
