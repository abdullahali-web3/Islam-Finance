import { z } from 'zod';

/** Investment-purification input schema (ADR 0001). Messages passed in translated (ADR 0009). */
export type PurificationMessages = {
  amount: string;
  percentage: string;
  dividendRequired: string;
  sharesRequired: string;
};

export const DEFAULT_MESSAGES: PurificationMessages = {
  amount: 'Enter a number',
  percentage: 'Enter 0–100',
  dividendRequired: 'Enter the dividends received',
  sharesRequired: 'Enter the number of shares',
};

const MAX = 1_000_000_000_000;

function buildObject(m: PurificationMessages) {
  const nonneg = z.number({ message: m.amount }).nonnegative(m.amount).max(MAX, m.amount);
  return z.object({
    method: z.enum(['byDividend', 'perShare']),
    dividendAmount: nonneg,
    impurePercentage: z.number({ message: m.amount }).min(0, m.percentage).max(100, m.percentage),
    sharesHeld: nonneg,
    impureIncomePerShare: nonneg,
  });
}

export const purificationFields = buildObject(DEFAULT_MESSAGES);
export type PurificationFormValues = z.infer<typeof purificationFields>;

export function makePurificationSchema(messages: PurificationMessages = DEFAULT_MESSAGES) {
  return buildObject(messages).superRefine((v, ctx) => {
    if (v.method === 'byDividend' && v.dividendAmount <= 0) {
      ctx.addIssue({ code: 'custom', path: ['dividendAmount'], message: messages.dividendRequired });
    }
    if (v.method === 'perShare' && v.sharesHeld <= 0) {
      ctx.addIssue({ code: 'custom', path: ['sharesHeld'], message: messages.sharesRequired });
    }
  });
}

export const purificationDefaultValues: PurificationFormValues = {
  method: 'byDividend',
  dividendAmount: 0,
  impurePercentage: 0,
  sharesHeld: 0,
  impureIncomePerShare: 0,
};
