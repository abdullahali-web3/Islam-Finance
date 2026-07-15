import type { TFunction } from 'i18next';
import { formatMoney, type CurrencyCode } from '@/core/shared';
import { IRRIGATION, type UshrInput, type UshrResult } from '@/core/ushr';
import type { FieldConfig } from '@/components/CalculatorForm';
import type { BreakdownRow } from '@/components/ResultView';
import type { UshrFormValues } from '@/schemas/ushr.schema';

export function buildUshrFields(t: TFunction): FieldConfig<UshrFormValues>[] {
  return [
    { name: 'harvestKg', label: t('ushr.field.harvestKg'), type: 'number', placeholder: '0' },
    {
      name: 'irrigation',
      label: t('ushr.field.irrigation'),
      type: 'select',
      options: IRRIGATION.map((i) => ({ value: i, label: t(`ushr.irrigation.${i}`) })),
    },
    { name: 'pricePerKg', label: t('ushr.field.pricePerKg'), type: 'number', placeholder: '0' },
  ];
}

export function toUshrInput(v: UshrFormValues, ctx: { currency: CurrencyCode }): UshrInput {
  return {
    harvestKg: v.harvestKg,
    irrigation: v.irrigation,
    pricePerKg: v.pricePerKg ?? 0,
    currency: ctx.currency,
  };
}

/** 0.10 → "10%", 0.075 → "7.5%". */
function ratePct(rate: number): string {
  return `${+(rate * 100).toFixed(1)}%`;
}

export function buildUshrResultView(result: UshrResult, opts: { t: TFunction; locale: string }) {
  const { t, locale } = opts;
  const harvest = t('ushr.result.kg', { kg: result.harvestKg });

  if (!result.due) {
    // Honor the engine's belowNisab flag: "below niṣāb" (majority) vs "no harvest" (any school,
    // incl. Hanafi which has no niṣāb — mislabeling it "below niṣāb" would contradict the doc).
    const reasonKey = result.belowNisab ? 'ushr.result.belowNisab' : 'ushr.result.noHarvest';
    return {
      headline: t('ushr.result.none'),
      headlineLabel: undefined as string | undefined,
      rows: [
        { label: t('ushr.result.harvest'), value: harvest },
        { label: t('ushr.result.ruling'), value: t(reasonKey, { nisab: result.nisabKg }), emphasis: true },
      ] as BreakdownRow[],
      citation: t('ushr.result.citation', { nisab: result.nisabKg }),
      disclaimer: t('ushr.result.disclaimer'),
    };
  }

  const rows: BreakdownRow[] = [
    { label: t('ushr.result.harvest'), value: harvest },
    { label: t('ushr.result.rate'), value: ratePct(result.rate) },
  ];
  if (result.ushrValue.amount > 0) {
    rows.push({
      label: t('ushr.result.value'),
      value: formatMoney(result.ushrValue, locale),
      emphasis: true,
    });
  }
  return {
    headline: t('ushr.result.kg', { kg: result.ushrKg }),
    headlineLabel: t('ushr.result.due'),
    rows,
    citation: t('ushr.result.citation', { nisab: result.nisabKg }),
    disclaimer: t('ushr.result.disclaimer'),
  };
}
