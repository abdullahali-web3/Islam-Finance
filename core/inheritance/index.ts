// Public surface of the Inheritance (Farāʾiḍ) engine (docs/fiqh/inheritance.md). Features/UI import
// from here only — never from internal files or the madhab/ folder directly.
export { distributeInheritance } from './distribute';
export {
  UnsupportedInheritanceCase,
  type HeirKey,
  type HeirShare,
  type InheritanceInput,
  type InheritanceResult,
} from './types';
export { getRuleModule, ALL_RULE_MODULES } from './madhab';
export { type InheritanceRuleModule, type MadhabSchool } from './madhab/types';
export { type Fraction } from './fraction';
