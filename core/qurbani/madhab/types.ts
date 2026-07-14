// RuleModule contract for Qurbani's madhab divergence (ADR 0003). See docs/fiqh/qurbani.md.
export type MadhabSchool = 'hanafi' | 'shafii' | 'maliki' | 'hanbali';

export interface QurbaniRuleModule {
  readonly school: MadhabSchool;
  /** Hanafi: wajib on a resident adult who owns nisab (D2). Others: sunnah muʾakkadah (false). */
  readonly obligatoryIfNisab: boolean;
}
