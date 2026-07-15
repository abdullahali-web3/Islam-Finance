import type { MadhabSchool, QadaRuleModule } from './types';
import { hanafi } from './hanafi';
import { shafii } from './shafii';
import { maliki } from './maliki';
import { hanbali } from './hanbali';

const MODULES: Record<MadhabSchool, QadaRuleModule> = { hanafi, shafii, maliki, hanbali };

export function getRuleModule(school: MadhabSchool): QadaRuleModule {
  return MODULES[school];
}

export const ALL_RULE_MODULES: readonly QadaRuleModule[] = [hanafi, shafii, maliki, hanbali];
