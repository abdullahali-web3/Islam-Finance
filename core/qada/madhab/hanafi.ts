import type { QadaRuleModule } from './types';

/** Hanafi: Witr is wājib → 6 make-ups/day; no fidya for a delayed fast makeup (makeup only). */
export const hanafi: QadaRuleModule = {
  school: 'hanafi',
  includesWitr: true,
  fidyaForDelayedFast: false,
};
