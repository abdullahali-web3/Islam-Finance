import type { QadaRuleModule } from './types';

/** Maliki: Witr is sunnah (not made up) → 5/day; fidya owed for a fast makeup delayed past Ramadan. */
export const maliki: QadaRuleModule = {
  school: 'maliki',
  includesWitr: false,
  fidyaForDelayedFast: true,
};
