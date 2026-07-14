import { money } from '@/core/shared';
import {
  frac,
  addF,
  subF,
  mulF,
  divF,
  cmpF,
  isZero,
  sumF,
  ONE,
  ZERO,
  type Fraction,
} from './fraction';
import type { InheritanceRuleModule } from './madhab/types';
import {
  UnsupportedInheritanceCase,
  type HeirKey,
  type HeirShare,
  type InheritanceInput,
  type InheritanceResult,
} from './types';

/**
 * Farāʾiḍ distribution engine (docs/fiqh/inheritance.md). Pure TS, exact-fraction arithmetic. Reads
 * madhab divergences from the RuleModule (ADR 0003), never branches on the school string. Genuinely
 * intricate/rare combinations (grandfather-muqāsama mixed with other fixed heirs / al-Akdariyya,
 * full+consanguine sibling interactions) are GUARDED as UnsupportedInheritanceCase — the app surfaces
 * "not yet supported" rather than risk a wrong inheritance (spec D9).
 */

type FixedAssign = { heir: HeirKey; count: number; fraction: Fraction };
type ResiduaryMember = { heir: HeirKey; count: number; weightPerHead: number };

const HALF = frac(1, 2);
const QUARTER = frac(1, 4);
const EIGHTH = frac(1, 8);
const TWO_THIRDS = frac(2, 3);
const THIRD = frac(1, 3);
const SIXTH = frac(1, 6);

const DISPLAY_ORDER: HeirKey[] = [
  'husband',
  'wife',
  'father',
  'mother',
  'paternalGrandfather',
  'paternalGrandmother',
  'maternalGrandmother',
  'son',
  'daughter',
  'sonsSon',
  'sonsDaughter',
  'fullBrother',
  'fullSister',
  'paternalBrother',
  'paternalSister',
  'maternalSibling',
];

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

function amountOf(fraction: Fraction, estate: number): number {
  // n*estate/d keeps thirds/sevenths exact when they divide; round to cents otherwise.
  return round2((fraction.n * estate) / fraction.d);
}

export function distributeInheritance(
  input: InheritanceInput,
  rule: InheritanceRuleModule
): InheritanceResult {
  const {
    estate,
    currency,
    husband,
    wives,
    father,
    mother,
    sons,
    daughters,
    sonsSons,
    sonsDaughters,
    paternalGrandfather,
    paternalGrandmother,
    maternalGrandmother,
    fullBrothers,
    fullSisters,
    paternalBrothers,
    paternalSisters,
    maternalSiblings,
  } = input;

  const hasSpouse = husband || wives > 0;
  const spouseFraction = (() => {
    if (!hasSpouse) return ZERO;
    const withDesc = sons + daughters + sonsSons + sonsDaughters > 0;
    if (husband) return withDesc ? QUARTER : HALF;
    return withDesc ? EIGHTH : QUARTER;
  })();

  // --- descendants ---
  const hasSon = sons > 0;
  const effSonsSons = hasSon ? 0 : sonsSons; // son's sons blocked by a son
  const hasMaleDescendant = hasSon || effSonsSons > 0;
  const hasDescendant = sons + daughters + sonsSons + sonsDaughters > 0;
  const hasFemaleOnlyDescendant = hasDescendant && !hasMaleDescendant;

  const rawSiblingCount =
    fullBrothers + fullSisters + paternalBrothers + paternalSisters + maternalSiblings;

  const fixed: FixedAssign[] = [];
  const blocked: { heir: HeirKey; count: number }[] = [];
  const residuary: ResiduaryMember[] = [];
  let muqasamaResult: FixedAssign[] | null = null;

  const addFixed = (heir: HeirKey, count: number, fraction: Fraction) => {
    if (count > 0 && !isZero(fraction)) fixed.push({ heir, count, fraction });
  };
  const addBlocked = (heir: HeirKey, count: number) => {
    if (count > 0) blocked.push({ heir, count });
  };

  // --- spouse ---
  if (husband) addFixed('husband', 1, spouseFraction);
  else if (wives > 0) addFixed('wife', wives, spouseFraction);

  // --- Umariyyatān: spouse + BOTH parents, no descendant, no siblings ---
  const isUmariyyatan =
    hasSpouse && father && mother && !hasDescendant && rawSiblingCount === 0;

  // --- mother ---
  let motherFraction: Fraction = ZERO;
  if (mother) {
    if (isUmariyyatan) {
      motherFraction = mulF(THIRD, subF(ONE, spouseFraction)); // ⅓ of the remainder after spouse
    } else {
      motherFraction = hasDescendant || rawSiblingCount >= 2 ? SIXTH : THIRD;
    }
    addFixed('mother', 1, motherFraction);
  }

  // --- father / grandfather (father takes precedence; grandfather only if no father) ---
  const ascendantMale: HeirKey | null = father
    ? 'father'
    : paternalGrandfather
      ? 'paternalGrandfather'
      : null;

  // grandfather + siblings (non-Hanafi muqāsama) is only supported in the clean "grandfather + only
  // brothers, no other heirs" shape; anything richer is guarded (spec D9, al-Akdariyya included).
  const gfWithSiblings =
    ascendantMale === 'paternalGrandfather' &&
    rawSiblingCount > 0 &&
    !rule.grandfatherBlocksSiblings;

  if (gfWithSiblings) {
    const onlyGfAndFullBrothers =
      !hasSpouse &&
      !mother &&
      !hasDescendant &&
      !paternalGrandmother &&
      !maternalGrandmother &&
      fullSisters === 0 &&
      paternalBrothers === 0 &&
      paternalSisters === 0 &&
      maternalSiblings === 0 &&
      fullBrothers > 0;
    if (!onlyGfAndFullBrothers) {
      throw new UnsupportedInheritanceCase(
        'grandfather-with-siblings (muqāsama) is only supported in the simple grandfather + full-brothers case in V1'
      );
    }
    // Muqāsama (Zayd): grandfather counts as a brother; he takes the better of ⅓ or an equal share.
    const equalShare = frac(1, fullBrothers + 1);
    const gfShare = cmpF(THIRD, equalShare) >= 0 ? THIRD : equalShare;
    const perBrother = divF(subF(ONE, gfShare), frac(fullBrothers));
    muqasamaResult = [
      { heir: 'paternalGrandfather', count: 1, fraction: gfShare },
      { heir: 'fullBrother', count: fullBrothers, fraction: mulF(perBrother, frac(fullBrothers)) },
    ];
  }

  if (!muqasamaResult && ascendantMale) {
    if (isUmariyyatan) {
      // father is the residuary, taking the remainder after spouse + mother
      residuary.push({ heir: ascendantMale, count: 1, weightPerHead: 1 });
    } else if (hasMaleDescendant) {
      addFixed(ascendantMale, 1, SIXTH); // ⅙ only
    } else if (hasFemaleOnlyDescendant) {
      addFixed(ascendantMale, 1, SIXTH); // ⅙ + residue (added below)
      residuary.push({ heir: ascendantMale, count: 1, weightPerHead: 1 });
    } else {
      residuary.push({ heir: ascendantMale, count: 1, weightPerHead: 1 }); // pure residuary
    }
  }

  // --- grandmothers (⅙ shared) ---
  if (!muqasamaResult) {
    const gms: HeirKey[] = [];
    if (maternalGrandmother && !mother) gms.push('maternalGrandmother');
    if (paternalGrandmother && !father && !mother) gms.push('paternalGrandmother');
    if (gms.length > 0) {
      const each = divF(SIXTH, frac(gms.length));
      for (const gm of gms) addFixed(gm, 1, each);
    }
    if (paternalGrandmother && (father || mother)) addBlocked('paternalGrandmother', 1);
    if (maternalGrandmother && mother) addBlocked('maternalGrandmother', 1);
  }

  // --- children + grandchildren ---
  if (!muqasamaResult) {
    if (hasSon) {
      residuary.push({ heir: 'son', count: sons, weightPerHead: 2 });
      if (daughters > 0) residuary.push({ heir: 'daughter', count: daughters, weightPerHead: 1 });
      addBlocked('sonsSon', sonsSons);
      addBlocked('sonsDaughter', sonsDaughters);
    } else if (effSonsSons > 0) {
      if (daughters > 0) addFixed('daughter', daughters, daughters === 1 ? HALF : TWO_THIRDS);
      residuary.push({ heir: 'sonsSon', count: effSonsSons, weightPerHead: 2 });
      if (sonsDaughters > 0)
        residuary.push({ heir: 'sonsDaughter', count: sonsDaughters, weightPerHead: 1 });
    } else {
      if (daughters > 0) addFixed('daughter', daughters, daughters === 1 ? HALF : TWO_THIRDS);
      if (sonsDaughters > 0) {
        if (daughters === 0) {
          addFixed('sonsDaughter', sonsDaughters, sonsDaughters === 1 ? HALF : TWO_THIRDS);
        } else if (daughters === 1) {
          addFixed('sonsDaughter', sonsDaughters, SIXTH); // takmilat al-thuluthayn
        } else {
          addBlocked('sonsDaughter', sonsDaughters); // ≥2 daughters, no son's son
        }
      }
    }
  }

  // --- siblings ---
  if (!muqasamaResult) {
    const ascendantBlocksCollaterals =
      father || (paternalGrandfather && rule.grandfatherBlocksSiblings);

    // Uterine (maternal) — ⅙ / ⅓ equally; blocked by any descendant, father, or grandfather.
    const uterineInherit = maternalSiblings > 0 && !hasDescendant && !father && !paternalGrandfather;
    if (maternalSiblings > 0) {
      if (uterineInherit) {
        addFixed('maternalSibling', maternalSiblings, maternalSiblings === 1 ? SIXTH : THIRD);
      } else {
        addBlocked('maternalSibling', maternalSiblings);
      }
    }

    // Full siblings — blocked by a male descendant or a blocking ascendant.
    const fullInherit =
      fullBrothers + fullSisters > 0 && !hasMaleDescendant && !ascendantBlocksCollaterals;
    const consanguineInherit =
      paternalBrothers + paternalSisters > 0 && !hasMaleDescendant && !ascendantBlocksCollaterals;

    // V1 guards the intricate full+consanguine interaction (blocking/⅙-completion). Support
    // consanguine only as a clean substitute when there are no full siblings.
    if (fullInherit && (paternalBrothers > 0 || paternalSisters > 0)) {
      throw new UnsupportedInheritanceCase(
        'full and consanguine siblings together are not supported in V1'
      );
    }

    const applySiblingGroup = (
      brothersKey: HeirKey,
      sistersKey: HeirKey,
      brothers: number,
      sisters: number,
      inherit: boolean
    ) => {
      if (brothers + sisters === 0) return;
      if (!inherit) {
        addBlocked(brothersKey, brothers);
        addBlocked(sistersKey, sisters);
        return;
      }
      if (hasFemaleOnlyDescendant) {
        // ʿaṣaba maʿa 'l-ghayr: siblings take the residue (2:1).
        if (brothers > 0) residuary.push({ heir: brothersKey, count: brothers, weightPerHead: 2 });
        if (sisters > 0) residuary.push({ heir: sistersKey, count: sisters, weightPerHead: 1 });
      } else if (brothers > 0) {
        residuary.push({ heir: brothersKey, count: brothers, weightPerHead: 2 });
        if (sisters > 0) residuary.push({ heir: sistersKey, count: sisters, weightPerHead: 1 });
      } else {
        addFixed(sistersKey, sisters, sisters === 1 ? HALF : TWO_THIRDS); // sisters alone → fixed
      }
    };

    applySiblingGroup('fullBrother', 'fullSister', fullBrothers, fullSisters, fullInherit);
    if (!fullInherit) {
      applySiblingGroup(
        'paternalBrother',
        'paternalSister',
        paternalBrothers,
        paternalSisters,
        consanguineInherit
      );
    } else {
      addBlocked('paternalBrother', paternalBrothers);
      addBlocked('paternalSister', paternalSisters);
    }
  }

  // ---------- assemble shares ----------
  let finalShares: FixedAssign[];
  let adjustment: 'none' | 'awl' | 'radd' | 'baytalmal' = 'none';

  if (muqasamaResult) {
    finalShares = muqasamaResult;
  } else {
    const sumFixed = sumF(fixed.map((f) => f.fraction));
    const residue = subF(ONE, sumFixed);
    const hasResiduary = residuary.length > 0;

    if (hasResiduary && cmpF(residue, ZERO) > 0) {
      // Distribute the residue to the single nearest residuary group already collected.
      const totalWeight = residuary.reduce((s, m) => s + m.count * m.weightPerHead, 0);
      const resid = residue;
      // father/grandfather may appear both in `fixed` (⅙) and here — merge below.
      const residuaryShares: FixedAssign[] = residuary.map((m) => ({
        heir: m.heir,
        count: m.count,
        fraction: mulF(resid, frac(m.count * m.weightPerHead, totalWeight)),
      }));
      finalShares = mergeShares(fixed, residuaryShares);
    } else if (hasResiduary) {
      // residue is 0 (or negative): residuary members get nothing; only fixed shares stand.
      finalShares = fixed;
      if (cmpF(sumFixed, ONE) > 0) {
        adjustment = 'awl';
        finalShares = applyAwl(fixed, sumFixed);
      }
    } else {
      // No residuary → ʿAwl, Radd, or surplus withheld to Bayt al-Māl (per the RuleModule, D1/D2).
      const c = cmpF(sumFixed, ONE);
      if (c > 0) {
        adjustment = 'awl';
        finalShares = applyAwl(fixed, sumFixed);
      } else if (c < 0) {
        const onlySpouseFixed = fixed.every((f) => f.heir === 'husband' || f.heir === 'wife');
        // Surplus is withheld (→ Bayt al-Māl) when this school doesn't apply Radd, or when the sole
        // fixed heir is a spouse and Radd-to-spouse is off. Otherwise the surplus is returned (Radd).
        if (!rule.appliesRadd || (onlySpouseFixed && !rule.raddToSpouseWhenSole)) {
          adjustment = 'baytalmal';
          finalShares = fixed; // fixed shares stand; the remainder is not distributed to heirs
        } else {
          adjustment = 'radd';
          finalShares = applyRadd(fixed, spouseFraction, husband || wives > 0);
        }
      } else {
        finalShares = fixed; // shares sum to exactly the estate
      }
    }

    // --- al-Mushtaraka override (Shafiʿi/Maliki): full siblings share the uterine ⅓ equally ---
    finalShares = maybeApplyMushtaraka(finalShares, input, rule);
  }

  const shares: HeirShare[] = finalShares
    .filter((s) => !isZero(s.fraction))
    .map((s) => {
      const total = amountOf(s.fraction, estate);
      return {
        heir: s.heir,
        count: s.count,
        fraction: s.fraction,
        amount: money(total, currency),
        perHeadAmount: money(round2(total / s.count), currency),
        basis: basisFor(s.heir, residuary, muqasamaResult),
      };
    })
    .sort((a, b) => DISPLAY_ORDER.indexOf(a.heir) - DISPLAY_ORDER.indexOf(b.heir));

  const totalDistributed = shares.reduce((sum, s) => sum + s.amount.amount, 0);

  return {
    estate: money(estate, currency),
    shares,
    blocked,
    adjustment,
    totalDistributed: money(round2(totalDistributed), currency),
    madhab: rule.school,
  };
}

function mergeShares(a: FixedAssign[], b: FixedAssign[]): FixedAssign[] {
  const map = new Map<HeirKey, FixedAssign>();
  for (const s of [...a, ...b]) {
    const existing = map.get(s.heir);
    if (existing) existing.fraction = addF(existing.fraction, s.fraction);
    else map.set(s.heir, { ...s });
  }
  return [...map.values()];
}

function applyAwl(fixed: FixedAssign[], sumFixed: Fraction): FixedAssign[] {
  return fixed.map((f) => ({ ...f, fraction: divF(f.fraction, sumFixed) }));
}

function applyRadd(
  fixed: FixedAssign[],
  spouseFraction: Fraction,
  hasSpouse: boolean
): FixedAssign[] {
  const nonSpouse = fixed.filter((f) => f.heir !== 'husband' && f.heir !== 'wife');
  const nonSpouseSum = sumF(nonSpouse.map((f) => f.fraction));

  if (nonSpouse.length === 0) {
    // Sole-heir spouse (only reached when raddToSpouseWhenSole is on) → the whole estate (D2).
    return fixed.map((f) => ({ ...f, fraction: ONE }));
  }

  const remaining = subF(ONE, hasSpouse ? spouseFraction : ZERO);
  return fixed.map((f) => {
    if (f.heir === 'husband' || f.heir === 'wife') return f; // spouse keeps its fixed share
    return { ...f, fraction: mulF(divF(f.fraction, nonSpouseSum), remaining) };
  });
}

function maybeApplyMushtaraka(
  shares: FixedAssign[],
  input: InheritanceInput,
  rule: InheritanceRuleModule
): FixedAssign[] {
  if (!rule.mushtarakaSharesFullBrothers) return shares;
  const fullCount = input.fullBrothers + input.fullSisters;
  const trigger =
    input.husband &&
    (input.mother || input.paternalGrandmother || input.maternalGrandmother) &&
    input.maternalSiblings >= 2 &&
    fullCount > 0 &&
    input.sons + input.daughters + input.sonsSons + input.sonsDaughters === 0 &&
    !input.father &&
    !input.paternalGrandfather;
  if (!trigger) return shares;

  const uterine = shares.find((s) => s.heir === 'maternalSibling');
  if (!uterine) return shares;

  // Split the uterine block equally among uterine + full siblings (males = females here).
  const totalHeads = input.maternalSiblings + fullCount;
  const each = divF(uterine.fraction, frac(totalHeads));
  const rest = shares.filter((s) => s.heir !== 'maternalSibling');
  const merged: FixedAssign[] = [
    ...rest,
    { heir: 'maternalSibling', count: input.maternalSiblings, fraction: mulF(each, frac(input.maternalSiblings)) },
  ];
  if (input.fullBrothers > 0)
    merged.push({ heir: 'fullBrother', count: input.fullBrothers, fraction: mulF(each, frac(input.fullBrothers)) });
  if (input.fullSisters > 0)
    merged.push({ heir: 'fullSister', count: input.fullSisters, fraction: mulF(each, frac(input.fullSisters)) });
  return merged;
}

function basisFor(
  heir: HeirKey,
  residuary: ResiduaryMember[],
  muqasama: FixedAssign[] | null
): HeirShare['basis'] {
  if (muqasama) return 'muqasama';
  const isResiduary = residuary.some((m) => m.heir === heir);
  const isAscendant = heir === 'father' || heir === 'paternalGrandfather';
  if (isResiduary && isAscendant) return 'fixed+residuary';
  if (isResiduary) return 'residuary';
  return 'fixed';
}
