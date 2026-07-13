// The RuleModule contract for Zakat's madhab-dependent points (ADR 0003). The engine reads these
// flags from the user's selected school and NEVER branches on the madhab string itself, so every
// divergence is reviewable as four small parallel files (hanafi/shafii/maliki/hanbali.ts).

export type MadhabSchool = 'hanafi' | 'shafii' | 'maliki' | 'hanbali';

/** Which metal's threshold is used to test nisab (a user setting per ADR 0009, not a madhab rule). */
export type NisabBasis = 'gold' | 'silver';

export interface ZakatRuleModule {
  readonly school: MadhabSchool;
  /**
   * Is customary personal-use jewelry (worn, not traded) zakatable?
   * Divergence point (zakat.md), Implementation Defaults D6/D7.
   */
  readonly personalJewelryZakatable: boolean;
  /**
   * Haul-continuity model. Divergence point (zakat.md), Implementation Default D8.
   * RECORDED for future date-tracking; V1 does not yet consume it — the engine uses a
   * user-declared `haulComplete` boolean, so no school's value changes a V1 result.
   */
  readonly haulContinuity: 'endpoints-only' | 'continuous';
}
