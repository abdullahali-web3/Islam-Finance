import type { ZakatRuleModule } from './types';

/**
 * Hanafi Zakat rules (docs/fiqh/zakat.md, Madhab Divergence Points).
 * - Jewelry: zakatable regardless of use (personal-use worn jewelry IS zakatable).
 * - Haul: checks nisab only at the start and end of the year; mid-year dips don't reset the clock.
 */
export const hanafi: ZakatRuleModule = {
  school: 'hanafi',
  personalJewelryZakatable: true,
  haulContinuity: 'endpoints-only',
};
