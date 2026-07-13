import type { MadhabSchool, InheritanceRuleModule } from './types';
import { hanafi } from './hanafi';
import { shafii } from './shafii';
import { maliki } from './maliki';
import { hanbali } from './hanbali';

const MODULES: Record<MadhabSchool, InheritanceRuleModule> = { hanafi, shafii, maliki, hanbali };

/** Resolve the RuleModule for a school (ADR 0003). The engine reads flags; never branches on strings. */
export function getRuleModule(school: MadhabSchool): InheritanceRuleModule {
  return MODULES[school];
}

export const ALL_RULE_MODULES: readonly InheritanceRuleModule[] = [hanafi, shafii, maliki, hanbali];
