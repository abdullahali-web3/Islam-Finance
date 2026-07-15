import type { MadhabSchool, UshrRuleModule } from './types';
import { hanafi } from './hanafi';
import { shafii } from './shafii';
import { maliki } from './maliki';
import { hanbali } from './hanbali';

const MODULES: Record<MadhabSchool, UshrRuleModule> = { hanafi, shafii, maliki, hanbali };

export function getRuleModule(school: MadhabSchool): UshrRuleModule {
  return MODULES[school];
}

export const ALL_RULE_MODULES: readonly UshrRuleModule[] = [hanafi, shafii, maliki, hanbali];
