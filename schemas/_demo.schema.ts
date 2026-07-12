import { z } from 'zod';

/**
 * THROWAWAY schema — exists only to prove the generic CalculatorForm (RHF + Zod) pattern
 * before any real fiqh-approved calculator exists. Delete once the first real calculator
 * (Zakat) lands. Not wired into the home hub. See ADR 0001.
 */
export const demoSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  cashOnHand: z
    .number({ message: 'Enter an amount' })
    .nonnegative('Must be 0 or more'),
  currency: z.enum(['USD', 'PKR', 'GBP']),
});

export type DemoInput = z.infer<typeof demoSchema>;

export const demoDefaultValues: DemoInput = {
  fullName: '',
  cashOnHand: 0,
  currency: 'USD',
};
