import type { ZakatRuleModule } from './types';

/**
 * Hanbali Zakat rules (docs/fiqh/zakat.md, Madhab Divergence Points).
 * - Jewelry: majority position is exempt for customary personal use (a minority view, incl. Ibn
 *   Taymiyyah, holds it zakatable — flagged for scholar). V1 follows the majority: exempt (D6).
 * - Haul: continuous nisab required through the year (same as Shafi'i/Maliki).
 */
export const hanbali: ZakatRuleModule = {
  school: 'hanbali',
  personalJewelryZakatable: false,
  haulContinuity: 'continuous',
};
