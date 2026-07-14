import type { TFunction } from 'i18next';
import { formatMoney, type CurrencyCode } from '@/core/shared';
import { STAPLES, type FitranaInput, type FitranaResult } from '@/core/fitrana';
import type { FieldConfig } from '@/components/CalculatorForm';
import type { BreakdownRow } from '@/components/ResultView';
import type { FitranaFormValues } from '@/schemas/fitrana.schema';

export function buildFitranaFields(t: TFunction): FieldConfig<FitranaFormValues>[] {
  return [
    { name: 'people', label: t('fitrana.field.people'), type: 'number', placeholder: '1' },
    {
      name: 'method',
      label: t('fitrana.field.method'),
      type: 'select',
      options: [
        { value: 'perPerson', label: t('fitrana.method.perPerson') },
        { value: 'byStaple', label: t('fitrana.method.byStaple') },
      ],
    },
    { name: 'perPersonAmount', label: t('fitrana.field.perPersonAmount'), type: 'number', placeholder: '0' },
    {
      name: 'staple',
      label: t('fitrana.field.staple'),
      type: 'select',
      options: STAPLES.map((s) => ({ value: s, label: t(`fitrana.staple.${s}`) })),
    },
    { name: 'pricePerKg', label: t('fitrana.field.pricePerKg'), type: 'number', placeholder: '0' },
  ];
}

export function toFitranaInput(v: FitranaFormValues, ctx: { currency: CurrencyCode }): FitranaInput {
  return {
    people: v.people,
    currency: ctx.currency,
    method: v.method,
    perPersonAmount: v.perPersonAmount,
    staple: v.staple,
    pricePerKg: v.pricePerKg,
  };
}

export function buildFitranaResultView(
  result: FitranaResult,
  opts: { t: TFunction; locale: string }
) {
  const { t, locale } = opts;
  const rows: BreakdownRow[] = [
    { label: t('fitrana.result.perPerson'), value: formatMoney(result.perPerson, locale) },
    { label: t('fitrana.result.people'), value: String(result.people) },
  ];
  return {
    headline: formatMoney(result.total, locale),
    headlineLabel: t('fitrana.result.total'),
    rows,
    citation: t('fitrana.result.citation'),
    disclaimer: t('fitrana.result.disclaimer'),
  };
}
