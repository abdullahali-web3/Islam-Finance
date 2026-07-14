// Public surface of the Fitrana engine (docs/fiqh/fitrana.md).
export {
  calculateFitrana,
  type FitranaInput,
  type FitranaResult,
  type FitranaMethod,
} from './rules';
export { SA_KG, STAPLES, type Staple } from './constants';
export { getRuleModule, ALL_RULE_MODULES } from './madhab';
export { type FitranaRuleModule, type MadhabSchool } from './madhab/types';
