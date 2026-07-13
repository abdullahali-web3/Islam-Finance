import type { CurrencyCode } from '@/core/shared';
import type { NisabBasis, ZakatInput } from '@/core/zakat';
import type { ZakatFormValues } from '@/schemas/zakat.schema';

/** Bridge the flat form values to the engine's structured ZakatInput, attaching settings context. */
export function toZakatInput(
  v: ZakatFormValues,
  ctx: { currency: CurrencyCode; nisabBasis: NisabBasis }
): ZakatInput {
  return {
    cash: v.cash,
    personalDebtsDue: v.personalDebtsDue,
    goldGramsInvestment: v.goldGramsInvestment,
    goldGramsJewelry: v.goldGramsJewelry,
    silverGramsInvestment: v.silverGramsInvestment,
    silverGramsJewelry: v.silverGramsJewelry,
    goldPricePerGram: v.goldPricePerGram,
    silverPricePerGram: v.silverPricePerGram,
    business: {
      inventoryValue: v.businessInventoryValue,
      cash: v.businessCash,
      receivablesDue: v.businessReceivablesDue,
      liabilitiesDue: v.businessLiabilitiesDue,
    },
    haulComplete: v.haulComplete === 'yes',
    nisabBasis: ctx.nisabBasis,
    currency: ctx.currency,
  };
}
