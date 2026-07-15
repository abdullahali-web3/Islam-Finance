import { NISAB, type Species, type AnimalType } from './constants';
import type { LivestockRuleModule } from './madhab/types';

/**
 * Zakat on grazing livestock engine (docs/fiqh/livestock.md). Pure TS. Unlike the money-based
 * calculators, the zakat here is paid **in-kind** — the result is a list of animals (by age/type)
 * due, plus the permissible alternative at the two exact-multiple ambiguities (camels 200, cattle
 * 120). Assessed per species from (count, grazing, working, hawlMet, madhab).
 */

export type AnimalDue = { type: AnimalType; count: number };

export type NotDueReason =
  | 'below-nisab'
  | 'hawl-not-met'
  | 'not-grazing-exempt' // fodder-fed, and the madhab requires sāʾimah
  | 'working-exempt'; // ʿawāmil, and the madhab exempts them

export type LivestockInput = {
  species: Species;
  count: number;
  /** Sāʾimah — the herd freely grazes for most of the year (vs fodder-fed). */
  grazing: boolean;
  /** ʿAwāmil — the animals are used for work (plough/haulage/irrigation). */
  working: boolean;
  /** One full lunar year of ownership has elapsed on the herd. */
  hawlMet: boolean;
};

export type LivestockResult = {
  species: Species;
  count: number;
  due: boolean;
  /** The zakat owed, in-kind. Empty when `due === false`. */
  animals: AnimalDue[];
  /** A permissible alternative payment at exact-multiple ambiguities (camels 200, cattle 120); else null. */
  alternative: AnimalDue[] | null;
  /** Why nothing is owed, when `due === false`; else null. */
  reason: NotDueReason | null;
  /** Whether the madhab permits paying the cash value instead of the animal (informational note). */
  valuePaymentAllowed: boolean;
};

// ---- Formula 1: sheep & goats (ghanam) ---------------------------------------
function sheepGoatsDue(n: number): AnimalDue[] {
  let count: number;
  if (n <= 120) count = 1;
  else if (n <= 200) count = 2;
  else if (n <= 300) count = 3;
  else count = Math.floor(n / 100); // above 300: one sheep per full hundred (400→4, 500→5, …)
  return [{ type: 'sheep', count }];
}

// ---- Formula 2: camels 5..120 (direct, agreed table) -------------------------
function camelTableUpTo120(n: number): AnimalDue[] {
  if (n <= 24) return [{ type: 'sheep', count: Math.floor(n / 5) }]; // 5–9→1, …, 20–24→4
  if (n <= 35) return [{ type: 'bintMakhad', count: 1 }];
  if (n <= 45) return [{ type: 'bintLabun', count: 1 }];
  if (n <= 60) return [{ type: 'hiqqah', count: 1 }];
  if (n <= 75) return [{ type: 'jadhaah', count: 1 }];
  if (n <= 90) return [{ type: 'bintLabun', count: 2 }];
  return [{ type: 'hiqqah', count: 2 }]; // 91–120
}

// ---- Formulas 3 & 4: decompose n into (unitA smaller, unitB larger) ----------
// Cattle: unitA=30 tabīʿ, unitB=40 musinnah. Camels>120: unitA=40 bint labūn, unitB=50 ḥiqqah.
type Decomp = { a: number; b: number; r: number; total: number };

function toAnimals(d: Decomp, typeA: AnimalType, typeB: AnimalType): AnimalDue[] {
  const out: AnimalDue[] = [];
  if (d.a > 0) out.push({ type: typeA, count: d.a });
  if (d.b > 0) out.push({ type: typeB, count: d.b });
  return out;
}

function decompose(
  n: number,
  unitA: number,
  unitB: number,
  typeA: AnimalType,
  typeB: AnimalType
): { animals: AnimalDue[]; alternative: AnimalDue[] | null } {
  const candidates: Decomp[] = [];
  for (let b = 0; b <= Math.floor(n / unitB); b++) {
    const rem = n - unitB * b;
    const a = Math.floor(rem / unitA);
    candidates.push({ a, b, r: rem - unitA * a, total: a + b });
  }
  // D6 tie-break: minimise waqṣ (r) → fewest total animals → prefer the older animal (more unitB).
  candidates.sort((x, y) => x.r - y.r || x.total - y.total || y.b - x.b);
  const best = candidates[0];
  // Owner's-choice alternative: surfaced ONLY at a common multiple of both age-unit sizes, where
  // each age alone composes the herd. `best` is then the fewest-animals payment (all of the older
  // age, unitB); the alternative is the other "whole type" — all of the younger age (unitA). So
  // cattle 120 → 3 musinnah OR 4 tabīʿ; camels 200 → 4 ḥiqqah OR 5 bint labūn. Mixed alternatives at
  // other sizes aren't cited, so we don't present them (docs/fiqh/livestock.md — Named Special Cases,
  // Flagged Uncertainty #3).
  const bothUnitsComposeExactly = n % unitA === 0 && n % unitB === 0;
  const alternative: AnimalDue[] | null = bothUnitsComposeExactly
    ? [{ type: typeA, count: n / unitA }]
    : null;
  return { animals: toAnimals(best, typeA, typeB), alternative };
}

function computeDue(species: Species, count: number): {
  animals: AnimalDue[];
  alternative: AnimalDue[] | null;
} {
  if (species === 'sheepGoats') return { animals: sheepGoatsDue(count), alternative: null };
  if (species === 'cattle') return decompose(count, 30, 40, 'tabi', 'musinnah');
  // camels
  if (count <= 120) return { animals: camelTableUpTo120(count), alternative: null };
  return decompose(count, 40, 50, 'bintLabun', 'hiqqah');
}

export function calculateLivestock(
  input: LivestockInput,
  rule: LivestockRuleModule
): LivestockResult {
  const { species, count, grazing, working, hawlMet } = input;
  const base = { species, count, valuePaymentAllowed: rule.valuePaymentAllowed };
  const notDue = (reason: NotDueReason): LivestockResult => ({
    ...base,
    due: false,
    animals: [],
    alternative: null,
    reason,
  });

  // Formula 0 — eligibility gate (order fixes the reported reason).
  if (count < NISAB[species]) return notDue('below-nisab');
  if (!hawlMet) return notDue('hawl-not-met');
  if (rule.requiresGrazing && !grazing) return notDue('not-grazing-exempt');
  if (rule.exemptsWorkingAnimals && working) return notDue('working-exempt');

  const { animals, alternative } = computeDue(species, count);
  return { ...base, due: true, animals, alternative, reason: null };
}
