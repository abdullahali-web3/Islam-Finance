import { money, type Money, type CurrencyCode } from '@/core/shared';
import { SHARES_PER_ANIMAL, type Animal } from './constants';
import type { QurbaniRuleModule } from './madhab/types';

/**
 * Qurbani / Udhiyah engine (docs/fiqh/qurbani.md). Pure TS. Indicates eligibility (obligatory vs
 * recommended, by madhab), computes shares/animals needed, and estimates cost. Returns Money.
 */

export type QurbaniStatus = 'obligatory' | 'recommended';

export type QurbaniInput = {
  /** How many people's Qurbani intentions to cover (household — see the per-person/household note). */
  people: number;
  currency: CurrencyCode;
  animal: Animal;
  pricePerShare: number;
  /** Owns nisab-level wealth on the days of Nahr (Hanafi obligation trigger). */
  ownsNisab: boolean;
  /** Resident (not a traveler) — relevant to the Hanafi obligation. */
  resident: boolean;
};

export type QurbaniResult = {
  status: QurbaniStatus;
  shares: number;
  animals: number;
  sharesPerAnimal: number;
  cost: Money;
};

export function calculateQurbani(input: QurbaniInput, rule: QurbaniRuleModule): QurbaniResult {
  const status: QurbaniStatus =
    rule.obligatoryIfNisab && input.ownsNisab && input.resident ? 'obligatory' : 'recommended';

  const sharesPerAnimal = SHARES_PER_ANIMAL[input.animal];
  const shares = input.people;
  const animals = Math.ceil(shares / sharesPerAnimal);
  const cost = Math.round(shares * input.pricePerShare * 100) / 100;

  return { status, shares, animals, sharesPerAnimal, cost: money(cost, input.currency) };
}
