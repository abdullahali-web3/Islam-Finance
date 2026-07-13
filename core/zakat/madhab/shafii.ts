import type { ZakatRuleModule } from './types';

/**
 * Shafi'i Zakat rules (docs/fiqh/zakat.md, Madhab Divergence Points).
 * - Jewelry: exempt if customary personal adornment (V1 treats personal-use jewelry as exempt, D6).
 * - Haul: requires continuous nisab throughout the year; a mid-year dip below nisab resets it.
 */
export const shafii: ZakatRuleModule = {
  school: 'shafii',
  personalJewelryZakatable: false,
  haulContinuity: 'continuous',
};
