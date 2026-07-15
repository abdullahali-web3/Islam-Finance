// Public surface of the ʿUshr engine (docs/fiqh/ushr.md).
export { calculateUshr, type UshrInput, type UshrResult } from './rules';
export { NISAB_KG, IRRIGATION, RATE, type Irrigation } from './constants';
export { getRuleModule, ALL_RULE_MODULES } from './madhab';
export { type UshrRuleModule, type MadhabSchool } from './madhab/types';
