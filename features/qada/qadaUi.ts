import type { TFunction } from 'i18next';
import { QADA_MODES, GENDERS, type QadaInput, type QadaResult } from '@/core/qada';
import type { FieldConfig } from '@/components/CalculatorForm';
import type { BreakdownRow } from '@/components/ResultView';
import type { QadaFormValues } from '@/schemas/qada.schema';

export function buildQadaFields(t: TFunction): FieldConfig<QadaFormValues>[] {
  const forPrayers = (v: QadaFormValues) => v.mode === 'prayers';
  const forFasts = (v: QadaFormValues) => v.mode === 'fasts';
  return [
    {
      name: 'mode',
      label: t('qada.field.mode'),
      type: 'select',
      options: QADA_MODES.map((m) => ({ value: m, label: t(`qada.mode.${m}`) })),
    },
    { name: 'years', label: t('qada.field.years'), type: 'number', placeholder: '0', visibleIf: forPrayers },
    { name: 'months', label: t('qada.field.months'), type: 'number', placeholder: '0', visibleIf: forPrayers },
    { name: 'days', label: t('qada.field.days'), type: 'number', placeholder: '0', visibleIf: forPrayers },
    {
      name: 'gender',
      label: t('qada.field.gender'),
      type: 'select',
      options: GENDERS.map((g) => ({ value: g, label: t(`qada.gender.${g}`) })),
      visibleIf: forPrayers,
    },
    {
      name: 'menstruationDaysPerMonth',
      label: t('qada.field.menstruationDaysPerMonth'),
      type: 'number',
      placeholder: '7',
      visibleIf: forPrayers,
    },
    {
      name: 'missedFastDays',
      label: t('qada.field.missedFastDays'),
      type: 'number',
      placeholder: '0',
      visibleIf: forFasts,
    },
    {
      name: 'delayedPastRamadan',
      label: t('qada.field.delayedPastRamadan'),
      type: 'select',
      options: [
        { value: 'no', label: t('common.no') },
        { value: 'yes', label: t('common.yes') },
      ],
      visibleIf: forFasts,
    },
  ];
}

export function toQadaInput(v: QadaFormValues): QadaInput {
  return {
    mode: v.mode,
    years: v.years,
    months: v.months,
    days: v.days,
    gender: v.gender,
    menstruationDaysPerMonth: v.menstruationDaysPerMonth,
    missedFastDays: v.missedFastDays,
    delayedPastRamadan: v.delayedPastRamadan === 'yes',
  };
}

export function buildQadaResultView(result: QadaResult, opts: { t: TFunction }) {
  const { t } = opts;

  if (result.mode === 'fasts') {
    const rows: BreakdownRow[] = [
      { label: t('qada.result.fastsToMakeUp'), value: String(result.fastsToMakeUp), emphasis: true },
    ];
    if (result.fidyaDueForDelay) {
      rows.push({ label: t('qada.result.fidyaNote'), value: t('qada.result.fidyaAlso') });
    }
    return {
      headline: t('qada.result.fastsCount', { n: result.fastsToMakeUp }),
      headlineLabel: t('qada.result.fastsDue') as string | undefined,
      rows,
      citation: t('qada.result.citationFasts'),
      disclaimer: t('qada.result.disclaimer'),
    };
  }

  const rows: BreakdownRow[] = [
    { label: t('qada.result.period'), value: t('qada.result.daysCount', { n: result.totalDays }) },
  ];
  if (result.menstruationDays > 0) {
    rows.push({
      label: t('qada.result.menstruationExcluded'),
      value: `− ${result.menstruationDays}`,
    });
    rows.push({ label: t('qada.result.prayingDays'), value: String(result.prayerDays) });
  }
  rows.push({ label: t('qada.result.fard'), value: String(result.fardTotal) });
  if (result.includesWitr) {
    rows.push({ label: t('qada.result.witr'), value: String(result.witrTotal) });
  }
  return {
    headline: t('qada.result.prayersCount', { n: result.total }),
    headlineLabel: t('qada.result.prayersDue') as string | undefined,
    rows,
    citation: t('qada.result.citationPrayers'),
    disclaimer: t('qada.result.disclaimer'),
  };
}
