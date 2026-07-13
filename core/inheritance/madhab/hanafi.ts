import type { InheritanceRuleModule } from './types';

/** Hanafi (docs/fiqh/inheritance.md divergence table): grandfather blocks siblings; full brothers
 *  get nothing in al-Mushtaraka; applies Radd (incl. to a sole spouse — diaspora default). */
export const hanafi: InheritanceRuleModule = {
  school: 'hanafi',
  grandfatherBlocksSiblings: true,
  mushtarakaSharesFullBrothers: false,
  appliesRadd: true,
  raddToSpouseWhenSole: true,
};
