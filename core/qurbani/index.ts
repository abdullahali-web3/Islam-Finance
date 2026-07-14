// Public surface of the Qurbani engine (docs/fiqh/qurbani.md).
export {
  calculateQurbani,
  type QurbaniInput,
  type QurbaniResult,
  type QurbaniStatus,
} from './rules';
export { ANIMALS, SHARES_PER_ANIMAL, type Animal } from './constants';
export { getRuleModule, ALL_RULE_MODULES } from './madhab';
export { type QurbaniRuleModule, type MadhabSchool } from './madhab/types';
