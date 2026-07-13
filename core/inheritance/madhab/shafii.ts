import type { InheritanceRuleModule } from './types';

/** Shafiʿi (docs/fiqh/inheritance.md): grandfather shares with siblings (muqāsama); full brothers
 *  share the uterine ⅓ in al-Mushtaraka. Radd is classically → Bayt al-Māl, but V1 applies Radd
 *  (no functioning treasury in the diaspora — flag 1); a scholar can flip `appliesRadd` to false. */
export const shafii: InheritanceRuleModule = {
  school: 'shafii',
  grandfatherBlocksSiblings: false,
  mushtarakaSharesFullBrothers: true,
  appliesRadd: true,
  raddToSpouseWhenSole: true,
};
