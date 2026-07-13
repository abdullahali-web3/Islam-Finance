import type { InheritanceRuleModule } from './types';

/** Maliki (docs/fiqh/inheritance.md): grandfather shares with siblings (muqāsama); full brothers
 *  share the uterine ⅓ in al-Mushtaraka. Radd classically → Bayt al-Māl (only if the treasury is
 *  orderly); V1 applies Radd in the diaspora (flag 1) — a scholar can flip `appliesRadd`. */
export const maliki: InheritanceRuleModule = {
  school: 'maliki',
  grandfatherBlocksSiblings: false,
  mushtarakaSharesFullBrothers: true,
  appliesRadd: true,
  raddToSpouseWhenSole: true,
};
