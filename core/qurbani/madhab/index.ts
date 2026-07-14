import type { MadhabSchool, QurbaniRuleModule } from './types';
import { hanafi } from './hanafi';
import { shafii } from './shafii';
import { maliki } from './maliki';
import { hanbali } from './hanbali';

const MODULES: Record<MadhabSchool, QurbaniRuleModule> = { hanafi, shafii, maliki, hanbali };

export function getRuleModule(school: MadhabSchool): QurbaniRuleModule {
  return MODULES[school];
}

export const ALL_RULE_MODULES: readonly QurbaniRuleModule[] = [hanafi, shafii, maliki, hanbali];
