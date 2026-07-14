import { z } from 'zod';

export type QurbaniMessages = {
  amount: string;
  integer: string;
  minPeople: string;
  priceRequired: string;
};

export const DEFAULT_MESSAGES: QurbaniMessages = {
  amount: 'Enter a number',
  integer: 'Whole number',
  minPeople: 'At least 1 person',
  priceRequired: 'Enter the price per share',
};

function buildObject(m: QurbaniMessages) {
  return z.object({
    people: z.number({ message: m.amount }).int(m.integer).min(1, m.minPeople),
    animal: z.enum(['sheep', 'goat', 'cow', 'buffalo', 'camel']),
    pricePerShare: z.number({ message: m.amount }).nonnegative(m.amount),
    ownsNisab: z.enum(['no', 'yes']),
    resident: z.enum(['yes', 'no']),
  });
}

export const qurbaniFields = buildObject(DEFAULT_MESSAGES);
export type QurbaniFormValues = z.infer<typeof qurbaniFields>;

export function makeQurbaniSchema(messages: QurbaniMessages = DEFAULT_MESSAGES) {
  return buildObject(messages).superRefine((v, ctx) => {
    if (v.pricePerShare <= 0) {
      ctx.addIssue({ code: 'custom', path: ['pricePerShare'], message: messages.priceRequired });
    }
  });
}

export const qurbaniDefaultValues: QurbaniFormValues = {
  people: 1,
  animal: 'sheep',
  pricePerShare: 0,
  ownsNisab: 'no',
  resident: 'yes',
};
