import type { MadhabSchool, FitranaRuleModule } from './types';
import { hanafi } from './hanafi';
import { shafii } from './shafii';
import { maliki } from './maliki';
import { hanbali } from './hanbali';

const MODULES: Record<MadhabSchool, FitranaRuleModule> = { hanafi, shafii, maliki, hanbali };

export function getRuleModule(school: MadhabSchool): FitranaRuleModule {
  return MODULES[school];
}

export const ALL_RULE_MODULES: readonly FitranaRuleModule[] = [hanafi, shafii, maliki, hanbali];
