import type { CurrencyCode, Money } from '@/core/shared';
import type { Fraction } from './fraction';
import type { MadhabSchool } from './madhab/types';

/** Every heir class the V1 engine understands (docs/fiqh/inheritance.md V1 scope). */
export type HeirKey =
  | 'husband'
  | 'wife'
  | 'father'
  | 'mother'
  | 'son'
  | 'daughter'
  | 'sonsSon'
  | 'sonsDaughter'
  | 'paternalGrandfather'
  | 'paternalGrandmother'
  | 'maternalGrandmother'
  | 'fullBrother'
  | 'fullSister'
  | 'paternalBrother'
  | 'paternalSister'
  | 'maternalSibling';

/**
 * Counts of each surviving heir. `husband` and `wives` are mutually exclusive (a deceased has one
 * sex). Amounts are distributed in a single currency (V1). This is the NET estate — after funeral,
 * debts, and valid bequests (docs/fiqh/inheritance.md scope).
 */
export type InheritanceInput = {
  estate: number;
  currency: CurrencyCode;
  husband: boolean;
  wives: number; // 0–4
  father: boolean;
  mother: boolean;
  sons: number;
  daughters: number;
  sonsSons: number;
  sonsDaughters: number;
  paternalGrandfather: boolean;
  paternalGrandmother: boolean;
  maternalGrandmother: boolean;
  fullBrothers: number;
  fullSisters: number;
  paternalBrothers: number;
  paternalSisters: number;
  maternalSiblings: number;
};

/** One heir class's outcome. `fraction` is the whole class's share of the estate (post ʿawl/radd). */
export type HeirShare = {
  heir: HeirKey;
  count: number;
  fraction: Fraction;
  /** Total money for the class. */
  amount: Money;
  /** Money for one individual in the class (amount / count). */
  perHeadAmount: Money;
  /** i18n-friendly reason tag for the UI, e.g. 'fixed', 'residuary', 'radd', 'muqasama'. */
  basis: 'fixed' | 'residuary' | 'fixed+residuary' | 'radd' | 'muqasama' | 'special';
};

export type InheritanceResult = {
  estate: Money;
  /** Inheriting heirs (share > 0), in a stable display order. */
  shares: HeirShare[];
  /** Heirs supplied but fully blocked (share 0) — surfaced so the user sees they were considered. */
  blocked: { heir: HeirKey; count: number }[];
  /** 'baytalmal' = a surplus remained that this school withholds from the heirs (public treasury). */
  adjustment: 'none' | 'awl' | 'radd' | 'baytalmal';
  totalDistributed: Money;
  madhab: MadhabSchool;
};

/** Thrown when the input needs a V1-unsupported rule (great-grandchildren, distant ʿaṣaba, …, D9). */
export class UnsupportedInheritanceCase extends Error {
  constructor(public readonly reason: string) {
    super(reason);
    this.name = 'UnsupportedInheritanceCase';
  }
}
