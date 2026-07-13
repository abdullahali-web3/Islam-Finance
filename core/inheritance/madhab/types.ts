// RuleModule contract for inheritance's madhab-dependent points (ADR 0003). The engine reads these
// flags from the selected school; it never branches on the madhab string. See docs/fiqh/inheritance.md
// "Madhab Divergence Points" + "Implementation Defaults".

export type MadhabSchool = 'hanafi' | 'shafii' | 'maliki' | 'hanbali';

export interface InheritanceRuleModule {
  readonly school: MadhabSchool;
  /** Grandfather + (full/consanguine) siblings: Hanafi → grandfather blocks them; others → muqāsama (D3). */
  readonly grandfatherBlocksSiblings: boolean;
  /** Al-Mushtaraka: Shafiʿi/Maliki → full brothers share the uterine ⅓; Hanafi/Hanbali → they get nothing (D4). */
  readonly mushtarakaSharesFullBrothers: boolean;
  /**
   * Apply Radd (return surplus to non-spouse fixed-share heirs) when there is no residuary (D1).
   * V1 default is TRUE for all four schools — the diaspora has no functioning Bayt al-Māl, so the
   * classical Shafiʿi/Maliki "surplus → treasury" is overridden. Recorded here so a scholar can flip
   * Shafiʿi/Maliki to false (forfeit surplus to Bayt al-Māl) without touching engine code.
   */
  readonly appliesRadd: boolean;
  /** Return a lone surviving spouse's surplus to that spouse (D2, diaspora default TRUE). */
  readonly raddToSpouseWhenSole: boolean;
}
