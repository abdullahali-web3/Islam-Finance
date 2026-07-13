import type { ZakatRuleModule } from './types';

/**
 * Maliki Zakat rules (docs/fiqh/zakat.md, Madhab Divergence Points).
 * - Jewelry: exempt within customary/reasonable personal use. The qualitative "excess beyond
 *   customary" test is disclaimed rather than encoded in V1 (Implementation Default D7), so this
 *   treats personal-use jewelry as exempt like Shafi'i/Hanbali.
 * - Haul: continuous nisab required through the year (same as Shafi'i).
 */
export const maliki: ZakatRuleModule = {
  school: 'maliki',
  personalJewelryZakatable: false,
  haulContinuity: 'continuous',
};
