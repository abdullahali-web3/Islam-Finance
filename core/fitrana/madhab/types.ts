// RuleModule contract for Fitrana's madhab divergence (ADR 0003). See docs/fiqh/fitrana.md.
export type MadhabSchool = 'hanafi' | 'shafii' | 'maliki' | 'hanbali';

export interface FitranaRuleModule {
  readonly school: MadhabSchool;
  /** Hanafi permit half a ṣāʿ of wheat/flour (D2); others require a full ṣāʿ of any staple. */
  readonly wheatIsHalfSa: boolean;
  /** Whether paying cash (value) instead of food is the classical position (informational, D3). */
  readonly cashIsClassical: boolean;
}
