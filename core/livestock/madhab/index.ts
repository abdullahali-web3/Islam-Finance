import type { MadhabSchool, LivestockRuleModule } from './types';
import { hanafi } from './hanafi';
import { shafii } from './shafii';
import { maliki } from './maliki';
import { hanbali } from './hanbali';

const MODULES: Record<MadhabSchool, LivestockRuleModule> = { hanafi, shafii, maliki, hanbali };

export function getRuleModule(school: MadhabSchool): LivestockRuleModule {
  return MODULES[school];
}

export const ALL_RULE_MODULES: readonly LivestockRuleModule[] = [hanafi, shafii, maliki, hanbali];
