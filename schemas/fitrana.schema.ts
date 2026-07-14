import { z } from 'zod';

/** Fitrana input schema (ADR 0001). Messages passed in translated (ADR 0009). */
export type FitranaMessages = {
  amount: string;
  integer: string;
  minPeople: string;
  perPersonRequired: string;
  priceRequired: string;
};

export const DEFAULT_MESSAGES: FitranaMessages = {
  amount: 'Enter a number',
  integer: 'Whole number',
  minPeople: 'At least 1 person',
  perPersonRequired: 'Enter the amount per person',
  priceRequired: 'Enter the price per kg',
};

function buildObject(m: FitranaMessages) {
  const nonneg = z.number({ message: m.amount }).nonnegative(m.amount);
  return z.object({
    people: z.number({ message: m.amount }).int(m.integer).min(1, m.minPeople),
    method: z.enum(['perPerson', 'byStaple']),
    perPersonAmount: nonneg,
    staple: z.enum(['dates', 'barley', 'raisins', 'wheat', 'rice']),
    pricePerKg: nonneg,
  });
}

export const fitranaFields = buildObject(DEFAULT_MESSAGES);
export type FitranaFormValues = z.infer<typeof fitranaFields>;

export function makeFitranaSchema(messages: FitranaMessages = DEFAULT_MESSAGES) {
  return buildObject(messages).superRefine((v, ctx) => {
    if (v.method === 'perPerson' && v.perPersonAmount <= 0) {
      ctx.addIssue({ code: 'custom', path: ['perPersonAmount'], message: messages.perPersonRequired });
    }
    if (v.method === 'byStaple' && v.pricePerKg <= 0) {
      ctx.addIssue({ code: 'custom', path: ['pricePerKg'], message: messages.priceRequired });
    }
  });
}

export const fitranaDefaultValues: FitranaFormValues = {
  people: 1,
  method: 'perPerson',
  perPersonAmount: 0,
  staple: 'dates',
  pricePerKg: 0,
};
