import { z } from 'zod';

/** ʿUshr input schema (ADR 0001). Messages passed in translated (ADR 0009). */
export type UshrMessages = {
  amount: string;
  harvestRequired: string;
};

export const DEFAULT_MESSAGES: UshrMessages = {
  amount: 'Enter a number',
  harvestRequired: 'Enter the harvest weight',
};

/** Sanity cap — far beyond any single harvest a phone user would enter. */
const MAX_KG = 100_000_000;

function buildObject(m: UshrMessages) {
  const nonneg = z.number({ message: m.amount }).nonnegative(m.amount);
  return z.object({
    harvestKg: nonneg.max(MAX_KG, m.amount),
    irrigation: z.enum(['natural', 'artificial', 'both']),
    // Genuinely optional — a cleared field (undefined) means "no price", not an error.
    pricePerKg: nonneg.max(MAX_KG, m.amount).optional(),
  });
}

export const ushrFields = buildObject(DEFAULT_MESSAGES);
export type UshrFormValues = z.infer<typeof ushrFields>;

export function makeUshrSchema(messages: UshrMessages = DEFAULT_MESSAGES) {
  return buildObject(messages).superRefine((v, ctx) => {
    if (v.harvestKg <= 0) {
      ctx.addIssue({ code: 'custom', path: ['harvestKg'], message: messages.harvestRequired });
    }
  });
}

export const ushrDefaultValues: UshrFormValues = {
  harvestKg: 0,
  irrigation: 'natural',
  pricePerKg: 0,
};
