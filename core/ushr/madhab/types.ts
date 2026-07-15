// RuleModule contract for ʿUshr's madhab divergence (ADR 0003). See docs/fiqh/ushr.md
// "Madhab Divergence Points". All four schools implemented explicitly (madhab-consistency-auditor).
export type MadhabSchool = 'hanafi' | 'shafii' | 'maliki' | 'hanbali';

export interface UshrRuleModule {
  readonly school: MadhabSchool;
  /** Is the 5-awsuq niṣāb required? Majority: yes. Hanafi (Abū Ḥanīfa): no — any amount (D2). */
  readonly requiresNisab: boolean;
  /** Niṣāb weight in kg (majority reference; not gated on when requiresNisab is false). */
  readonly nisabKg: number;
}
