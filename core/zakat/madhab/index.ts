import type { MadhabSchool, ZakatRuleModule } from './types';
import { hanafi } from './hanafi';
import { shafii } from './shafii';
import { maliki } from './maliki';
import { hanbali } from './hanbali';

const MODULES: Record<MadhabSchool, ZakatRuleModule> = { hanafi, shafii, maliki, hanbali };

/** Resolve the RuleModule for a school. The engine calls this once and reads flags — it never
 *  branches on the madhab string itself (ADR 0003). */
export function getRuleModule(school: MadhabSchool): ZakatRuleModule {
  return MODULES[school];
}

export const ALL_RULE_MODULES: readonly ZakatRuleModule[] = [hanafi, shafii, maliki, hanbali];
