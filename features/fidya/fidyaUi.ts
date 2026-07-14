import type { TFunction } from 'i18next';
import { formatMoney, type CurrencyCode } from '@/core/shared';
import type { FidyaInput, FidyaResult } from '@/core/fidya';
import type { FieldConfig } from '@/components/CalculatorForm';
import type { BreakdownRow } from '@/components/ResultView';
import type { FidyaFormValues } from '@/schemas/fidya.schema';

export function buildFidyaFields(t: TFunction): FieldConfig<FidyaFormValues>[] {
  return [
    {
      name: 'type',
      label: t('fidya.field.type'),
      type: 'select',
      options: [
        { value: 'fidya', label: t('fidya.type.fidya') },
        { value: 'kaffarah', label: t('fidya.type.kaffarah') },
      ],
    },
    { name: 'days', label: t('fidya.field.days'), type: 'number', placeholder: '1' },
    { name: 'perDayAmount', label: t('fidya.field.perDayAmount'), type: 'number', placeholder: '0' },
  ];
}

export function toFidyaInput(v: FidyaFormValues, ctx: { currency: CurrencyCode }): FidyaInput {
  return { type: v.type, days: v.days, perDayAmount: v.perDayAmount, currency: ctx.currency };
}

export function buildFidyaResultView(result: FidyaResult, opts: { t: TFunction; locale: string }) {
  const { t, locale } = opts;
  const rows: BreakdownRow[] = [
    { label: t('fidya.result.type'), value: t(`fidya.type.${result.type}`), emphasis: true },
    { label: t('fidya.result.days'), value: String(result.days) },
    { label: t('fidya.result.peopleFed'), value: String(result.peopleFed) },
  ];
  return {
    headline: formatMoney(result.total, locale),
    headlineLabel: t('fidya.result.total'),
    rows,
    citation:
      result.type === 'kaffarah' ? t('fidya.result.citationKaffarah') : t('fidya.result.citationFidya'),
    disclaimer: t('fidya.result.disclaimer'),
  };
}
