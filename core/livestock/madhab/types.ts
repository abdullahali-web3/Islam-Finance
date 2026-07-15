// RuleModule contract for Livestock's madhab divergence (ADR 0003). See docs/fiqh/livestock.md
// "Madhab Divergence Points". Every school is implemented explicitly (madhab-consistency-auditor).
export type MadhabSchool = 'hanafi' | 'shafii' | 'maliki' | 'hanbali';

export interface LivestockRuleModule {
  readonly school: MadhabSchool;
  /** Is sāʾimah (free-grazing) required? Majority: yes (fodder-fed exempt). Maliki: no (D2). */
  readonly requiresGrazing: boolean;
  /** Are working animals (ʿawāmil) exempt? Majority: yes. Maliki: no — still due (D3). */
  readonly exemptsWorkingAnimals: boolean;
  /** May the cash value be paid instead of the animal? Hanafi: yes; others in-kind (D4, informational). */
  readonly valuePaymentAllowed: boolean;
}
