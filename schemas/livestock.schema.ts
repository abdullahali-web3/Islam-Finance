import { z } from 'zod';

/**
 * Livestock (Zakāt al-Anʿām) FORM schema (ADR 0001). Messages passed in translated (ADR 0009).
 * The generic CalculatorForm only renders number/text/select, so the three conditions are yes/no
 * selects here and are mapped to the core engine's booleans in features/livestock/livestockUi.ts.
 */
export type LivestockMessages = {
  integer: string;
  minCount: string;
  maxCount: string;
};

export const DEFAULT_MESSAGES: LivestockMessages = {
  integer: 'Whole number of animals',
  minCount: 'Enter the herd size',
  maxCount: 'That is more animals than this supports',
};

/** Sanity cap — far beyond any real herd; also bounds the decomposition loop (QA hygiene). */
const MAX_COUNT = 1_000_000;

function buildObject(m: LivestockMessages) {
  return z.object({
    species: z.enum(['camels', 'cattle', 'sheepGoats']),
    count: z
      .number({ message: m.integer })
      .int(m.integer)
      .nonnegative(m.minCount)
      .max(MAX_COUNT, m.maxCount),
    grazing: z.enum(['yes', 'no']), // sāʾimah — free-grazing vs fodder-fed
    working: z.enum(['yes', 'no']), // ʿawāmil — used for work
    hawlMet: z.enum(['yes', 'no']), // one lunar year of ownership elapsed
  });
}

export const livestockFields = buildObject(DEFAULT_MESSAGES);
export type LivestockFormValues = z.infer<typeof livestockFields>;

export function makeLivestockSchema(messages: LivestockMessages = DEFAULT_MESSAGES) {
  return buildObject(messages);
}

export const livestockDefaultValues: LivestockFormValues = {
  species: 'sheepGoats',
  count: 0,
  grazing: 'yes',
  working: 'no',
  hawlMet: 'yes',
};
