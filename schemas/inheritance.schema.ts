import { z } from 'zod';

/**
 * Inheritance input schema (ADR 0001). Drives the generic <CalculatorForm/> and types the values
 * handed to the engine. The user enters the NET estate (after funeral/debts/bequests — inheritance.md
 * scope) plus counts of each surviving heir. Booleans are modeled as yes/no selects (the form engine's
 * field kinds). Messages are passed in translated (ADR 0009); DEFAULT_MESSAGES is an English fallback.
 */

export type InheritanceMessages = {
  amount: string;
  nonnegative: string;
  integer: string;
  estatePositive: string;
  spouseConflict: string;
  noHeirs: string;
};

export const DEFAULT_MESSAGES: InheritanceMessages = {
  amount: 'Enter a number',
  nonnegative: 'Must be 0 or more',
  integer: 'Must be a whole number',
  estatePositive: 'Enter the estate value',
  spouseConflict: 'A person cannot have both a husband and wives',
  noHeirs: 'Add at least one heir',
};

const YES_NO = ['no', 'yes'] as const;

function buildObject(m: InheritanceMessages) {
  const count = z
    .number({ message: m.amount })
    .int(m.integer)
    .nonnegative(m.nonnegative);
  const yesno = z.enum(YES_NO);
  return z.object({
    estate: z.number({ message: m.amount }).positive(m.estatePositive),
    husband: yesno,
    wives: count.max(4),
    father: yesno,
    mother: yesno,
    sons: count,
    daughters: count,
    sonsSons: count,
    sonsDaughters: count,
    paternalGrandfather: yesno,
    paternalGrandmother: yesno,
    maternalGrandmother: yesno,
    fullBrothers: count,
    fullSisters: count,
    paternalBrothers: count,
    paternalSisters: count,
    maternalSiblings: count,
  });
}

export const inheritanceFields = buildObject(DEFAULT_MESSAGES);
export type InheritanceFormValues = z.infer<typeof inheritanceFields>;

export function makeInheritanceSchema(messages: InheritanceMessages = DEFAULT_MESSAGES) {
  return buildObject(messages).superRefine((v, ctx) => {
    if (v.husband === 'yes' && v.wives > 0) {
      ctx.addIssue({ code: 'custom', path: ['wives'], message: messages.spouseConflict });
    }
    const heirCount =
      (v.husband === 'yes' ? 1 : 0) +
      v.wives +
      (v.father === 'yes' ? 1 : 0) +
      (v.mother === 'yes' ? 1 : 0) +
      v.sons +
      v.daughters +
      v.sonsSons +
      v.sonsDaughters +
      (v.paternalGrandfather === 'yes' ? 1 : 0) +
      (v.paternalGrandmother === 'yes' ? 1 : 0) +
      (v.maternalGrandmother === 'yes' ? 1 : 0) +
      v.fullBrothers +
      v.fullSisters +
      v.paternalBrothers +
      v.paternalSisters +
      v.maternalSiblings;
    if (heirCount === 0) {
      ctx.addIssue({ code: 'custom', path: ['estate'], message: messages.noHeirs });
    }
  });
}

export const inheritanceDefaultValues: InheritanceFormValues = {
  estate: 0,
  husband: 'no',
  wives: 0,
  father: 'no',
  mother: 'no',
  sons: 0,
  daughters: 0,
  sonsSons: 0,
  sonsDaughters: 0,
  paternalGrandfather: 'no',
  paternalGrandmother: 'no',
  maternalGrandmother: 'no',
  fullBrothers: 0,
  fullSisters: 0,
  paternalBrothers: 0,
  paternalSisters: 0,
  maternalSiblings: 0,
};
