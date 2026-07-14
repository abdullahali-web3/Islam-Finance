import type { TFunction } from 'i18next';
import { formatMoney, type CurrencyCode } from '@/core/shared';
import { ANIMALS, type QurbaniInput, type QurbaniResult } from '@/core/qurbani';
import type { FieldConfig } from '@/components/CalculatorForm';
import type { BreakdownRow } from '@/components/ResultView';
import type { QurbaniFormValues } from '@/schemas/qurbani.schema';

export function buildQurbaniFields(t: TFunction): FieldConfig<QurbaniFormValues>[] {
  const yesno = (name: keyof QurbaniFormValues): FieldConfig<QurbaniFormValues> => ({
    name,
    label: t(`qurbani.field.${name}`),
    type: 'select',
    options: [
      { value: 'yes', label: t('common.yes') },
      { value: 'no', label: t('common.no') },
    ],
  });
  return [
    { name: 'people', label: t('qurbani.field.people'), type: 'number', placeholder: '1' },
    {
      name: 'animal',
      label: t('qurbani.field.animal'),
      type: 'select',
      options: ANIMALS.map((a) => ({ value: a, label: t(`qurbani.animal.${a}`) })),
    },
    { name: 'pricePerShare', label: t('qurbani.field.pricePerShare'), type: 'number', placeholder: '0' },
    yesno('ownsNisab'),
    yesno('resident'),
  ];
}

export function toQurbaniInput(v: QurbaniFormValues, ctx: { currency: CurrencyCode }): QurbaniInput {
  return {
    people: v.people,
    currency: ctx.currency,
    animal: v.animal,
    pricePerShare: v.pricePerShare,
    ownsNisab: v.ownsNisab === 'yes',
    resident: v.resident === 'yes',
  };
}

export function buildQurbaniResultView(result: QurbaniResult, opts: { t: TFunction; locale: string }) {
  const { t, locale } = opts;
  const rows: BreakdownRow[] = [
    { label: t('qurbani.result.ruling'), value: t(`qurbani.status.${result.status}`), emphasis: true },
    { label: t('qurbani.result.shares'), value: String(result.shares) },
    { label: t('qurbani.result.animals'), value: String(result.animals) },
  ];
  return {
    headline: formatMoney(result.cost, locale),
    headlineLabel: t('qurbani.result.cost'),
    rows,
    citation: t('qurbani.result.citation'),
    disclaimer: t('qurbani.result.disclaimer'),
  };
}
