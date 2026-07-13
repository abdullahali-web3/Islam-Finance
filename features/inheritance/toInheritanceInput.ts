import type { CurrencyCode } from '@/core/shared';
import type { InheritanceInput } from '@/core/inheritance';
import type { InheritanceFormValues } from '@/schemas/inheritance.schema';

const yn = (x: 'yes' | 'no') => x === 'yes';

/** Bridge the flat form values to the engine's InheritanceInput, attaching the currency. */
export function toInheritanceInput(
  v: InheritanceFormValues,
  ctx: { currency: CurrencyCode }
): InheritanceInput {
  return {
    estate: v.estate,
    currency: ctx.currency,
    husband: yn(v.husband),
    wives: v.wives,
    father: yn(v.father),
    mother: yn(v.mother),
    sons: v.sons,
    daughters: v.daughters,
    sonsSons: v.sonsSons,
    sonsDaughters: v.sonsDaughters,
    paternalGrandfather: yn(v.paternalGrandfather),
    paternalGrandmother: yn(v.paternalGrandmother),
    maternalGrandmother: yn(v.maternalGrandmother),
    fullBrothers: v.fullBrothers,
    fullSisters: v.fullSisters,
    paternalBrothers: v.paternalBrothers,
    paternalSisters: v.paternalSisters,
    maternalSiblings: v.maternalSiblings,
  };
}
