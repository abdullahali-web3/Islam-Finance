// Public surface of the Zakat engine (docs/fiqh/zakat.md). Features/UI import from here only —
// never from internal files or the madhab/ folder directly.
export {
  calculateZakat,
  resolveNisabValue,
  type ZakatInput,
  type ZakatResult,
  type ZakatBreakdown,
} from './rules';
export { getRuleModule, ALL_RULE_MODULES } from './madhab';
export { type ZakatRuleModule, type MadhabSchool, type NisabBasis } from './madhab/types';
export { GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS, ZAKAT_RATE } from './constants';
