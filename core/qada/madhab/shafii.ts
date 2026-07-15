import type { QadaRuleModule } from './types';

/** Shafiʿi: Witr is sunnah (not made up) → 5/day; fidya owed for a fast makeup delayed past Ramadan. */
export const shafii: QadaRuleModule = {
  school: 'shafii',
  includesWitr: false,
  fidyaForDelayedFast: true,
};
