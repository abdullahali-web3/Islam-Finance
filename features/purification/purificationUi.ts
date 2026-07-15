import type { TFunction } from 'i18next';
import { formatMoney, money, type CurrencyCode } from '@/core/shared';
import { PURIFICATION_METHODS, type PurificationInput, type PurificationResult } from '@/core/purification';
import type { FieldConfig } from '@/components/CalculatorForm';
import type { BreakdownRow } from '@/components/ResultView';
import type { PurificationFormValues } from '@/schemas/purification.schema';

export function buildPurificationFields(t: TFunction): FieldConfig<PurificationFormValues>[] {
  const byDividend = (v: PurificationFormValues) => v.method === 'byDividend';
  const perShare = (v: PurificationFormValues) => v.method === 'perShare';
  return [
    {
      name: 'method',
      label: t('purification.field.method'),
      type: 'select',
      options: PURIFICATION_METHODS.map((m) => ({ value: m, label: t(`purification.method.${m}`) })),
    },
    {
      name: 'dividendAmount',
      label: t('purification.field.dividendAmount'),
      type: 'number',
      placeholder: '0',
      visibleIf: byDividend,
    },
    {
      name: 'impurePercentage',
      label: t('purification.field.impurePercentage'),
      type: 'number',
      placeholder: '0',
      visibleIf: byDividend,
    },
    {
      name: 'sharesHeld',
      label: t('purification.field.sharesHeld'),
      type: 'number',
      placeholder: '0',
      visibleIf: perShare,
    },
    {
      name: 'impureIncomePerShare',
      label: t('purification.field.impureIncomePerShare'),
      type: 'number',
      placeholder: '0',
      visibleIf: perShare,
    },
  ];
}

export function toPurificationInput(
  v: PurificationFormValues,
  ctx: { currency: CurrencyCode }
): PurificationInput {
  return {
    method: v.method,
    currency: ctx.currency,
    dividendAmount: v.dividendAmount,
    impurePercentage: v.impurePercentage,
    sharesHeld: v.sharesHeld,
    impureIncomePerShare: v.impureIncomePerShare,
  };
}

export function buildPurificationResultView(
  result: PurificationResult,
  opts: { t: TFunction; locale: string }
) {
  const { t, locale } = opts;
  const cur = result.purification.currency;
  const rows: BreakdownRow[] =
    result.method === 'byDividend'
      ? [
          { label: t('purification.result.dividend'), value: formatMoney(money(result.dividendAmount, cur), locale) },
          { label: t('purification.result.rate'), value: `${result.impurePercentage}%` },
        ]
      : [
          { label: t('purification.result.shares'), value: String(result.sharesHeld) },
          // Raw value, not formatMoney — a per-share figure like 0.015 must not round to 0.02 (that
          // would misrepresent the input a user cross-checks against the headline).
          { label: t('purification.result.perShare'), value: `${result.impureIncomePerShare} ${cur}` },
        ];
  return {
    headline: formatMoney(result.purification, locale),
    headlineLabel: t('purification.result.toPurify'),
    rows,
    citation: t('purification.result.citation'),
    disclaimer: t('purification.result.disclaimer'),
  };
}
