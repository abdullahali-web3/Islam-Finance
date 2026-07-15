// Public surface of the Qaḍāʾ engine (docs/fiqh/qada.md).
export {
  calculateQada,
  type QadaInput,
  type QadaResult,
  type PrayersResult,
  type FastsResult,
} from './rules';
export {
  DAYS_PER_YEAR,
  DAYS_PER_MONTH,
  FARD_PER_DAY,
  QADA_MODES,
  GENDERS,
  type QadaMode,
  type Gender,
} from './constants';
export { getRuleModule, ALL_RULE_MODULES } from './madhab';
export { type QadaRuleModule, type MadhabSchool } from './madhab/types';
