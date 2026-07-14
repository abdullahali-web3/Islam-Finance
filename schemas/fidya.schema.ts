import { z } from 'zod';

export type FidyaMessages = { amount: string; integer: string; minDays: string; priceRequired: string };

export const DEFAULT_MESSAGES: FidyaMessages = {
  amount: 'Enter a number',
  integer: 'Whole number',
  minDays: 'At least 1 day',
  priceRequired: 'Enter the amount to feed one person',
};

function buildObject(m: FidyaMessages) {
  return z.object({
    type: z.enum(['fidya', 'kaffarah']),
    days: z.number({ message: m.amount }).int(m.integer).min(1, m.minDays),
    perDayAmount: z.number({ message: m.amount }).nonnegative(m.amount),
  });
}

export const fidyaFields = buildObject(DEFAULT_MESSAGES);
export type FidyaFormValues = z.infer<typeof fidyaFields>;

export function makeFidyaSchema(messages: FidyaMessages = DEFAULT_MESSAGES) {
  return buildObject(messages).superRefine((v, ctx) => {
    if (v.perDayAmount <= 0) {
      ctx.addIssue({ code: 'custom', path: ['perDayAmount'], message: messages.priceRequired });
    }
  });
}

export const fidyaDefaultValues: FidyaFormValues = { type: 'fidya', days: 1, perDayAmount: 0 };
