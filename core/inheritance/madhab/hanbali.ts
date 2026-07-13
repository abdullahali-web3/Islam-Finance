import type { InheritanceRuleModule } from './types';

/** Hanbali (docs/fiqh/inheritance.md): grandfather shares with siblings (muqāsama); full brothers
 *  get nothing in al-Mushtaraka; applies Radd (incl. to a sole spouse — diaspora default). */
export const hanbali: InheritanceRuleModule = {
  school: 'hanbali',
  grandfatherBlocksSiblings: false,
  mushtarakaSharesFullBrothers: false,
  appliesRadd: true,
  raddToSpouseWhenSole: true,
};
