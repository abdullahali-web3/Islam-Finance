import { z } from 'zod';
import type { NisabBasis } from '@/core/zakat';

/**
 * Zakat input schema (ADR 0001). One Zod schema drives the generic <CalculatorForm/> AND types the
 * values handed to the core engine. All amounts are in the user's default currency (V1 single-
 * currency, zakat.md scope). Metal prices are entered manually (the price proxy is a stub until
 * deployed, ADR 0008). Validation messages are concise English for V1 (labels are i18n'd in the
 * screen); message localization is a documented follow-up.
 */

const amount = z.number({ message: 'Enter an amount' }).nonnegative('Must be 0 or more');

export const zakatFields = z.object({
  cash: amount,
  personalDebtsDue: amount,
  goldGramsInvestment: amount,
  goldGramsJewelry: amount,
  silverGramsInvestment: amount,
  silverGramsJewelry: amount,
  goldPricePerGram: amount,
  silverPricePerGram: amount,
  businessInventoryValue: amount,
  businessCash: amount,
  businessReceivablesDue: amount,
  businessLiabilitiesDue: amount,
  haulComplete: z.enum(['yes', 'no']),
});

export type ZakatFormValues = z.infer<typeof zakatFields>;

/**
 * Build the schema for the active nisab basis. A metal's price is required (> 0) when it's needed:
 * either it's the nisab basis (so the threshold can be computed) or the user holds that metal (so it
 * can be valued). This lets a cash-only user skip the price they don't need.
 */
export function makeZakatSchema(nisabBasis: NisabBasis) {
  return zakatFields.superRefine((v, ctx) => {
    const hasGold = v.goldGramsInvestment + v.goldGramsJewelry > 0;
    const hasSilver = v.silverGramsInvestment + v.silverGramsJewelry > 0;

    if ((nisabBasis === 'gold' || hasGold) && v.goldPricePerGram <= 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['goldPricePerGram'],
        message: 'Enter the current gold price per gram',
      });
    }
    if ((nisabBasis === 'silver' || hasSilver) && v.silverPricePerGram <= 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['silverPricePerGram'],
        message: 'Enter the current silver price per gram',
      });
    }
  });
}

export const zakatDefaultValues: ZakatFormValues = {
  cash: 0,
  personalDebtsDue: 0,
  goldGramsInvestment: 0,
  goldGramsJewelry: 0,
  silverGramsInvestment: 0,
  silverGramsJewelry: 0,
  goldPricePerGram: 0,
  silverPricePerGram: 0,
  businessInventoryValue: 0,
  businessCash: 0,
  businessReceivablesDue: 0,
  businessLiabilitiesDue: 0,
  haulComplete: 'yes',
};
