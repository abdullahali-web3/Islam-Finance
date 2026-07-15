// RuleModule contract for Qaḍāʾ's madhab divergence (ADR 0003). See docs/fiqh/qada.md
// "Madhab Divergence Points". All four schools implemented explicitly (madhab-consistency-auditor).
export type MadhabSchool = 'hanafi' | 'shafii' | 'maliki' | 'hanbali';

export interface QadaRuleModule {
  readonly school: MadhabSchool;
  /** Is Witr counted in prayer qaḍāʾ? Hanafi: yes (wājib → 6/day). Others: no (5/day) (D3). */
  readonly includesWitr: boolean;
  /** Is fidya owed for delaying a fast's makeup past the next Ramadan? Majority: yes; Hanafi: no (D4). */
  readonly fidyaForDelayedFast: boolean;
}
