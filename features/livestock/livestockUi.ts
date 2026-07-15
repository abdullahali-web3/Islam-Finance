import type { TFunction } from 'i18next';
import {
  SPECIES,
  type AnimalDue,
  type LivestockInput,
  type LivestockResult,
} from '@/core/livestock';
import type { FieldConfig } from '@/components/CalculatorForm';
import type { BreakdownRow } from '@/components/ResultView';
import type { LivestockFormValues } from '@/schemas/livestock.schema';

export function buildLivestockFields(t: TFunction): FieldConfig<LivestockFormValues>[] {
  const yesno = (name: keyof LivestockFormValues): FieldConfig<LivestockFormValues> => ({
    name,
    label: t(`livestock.field.${name}`),
    type: 'select',
    options: [
      { value: 'yes', label: t('common.yes') },
      { value: 'no', label: t('common.no') },
    ],
  });
  return [
    {
      name: 'species',
      label: t('livestock.field.species'),
      type: 'select',
      options: SPECIES.map((s) => ({ value: s, label: t(`livestock.species.${s}`) })),
    },
    { name: 'count', label: t('livestock.field.count'), type: 'number', placeholder: '0' },
    yesno('grazing'),
    yesno('working'),
    yesno('hawlMet'),
  ];
}

export function toLivestockInput(v: LivestockFormValues): LivestockInput {
  return {
    species: v.species,
    count: v.count,
    grazing: v.grazing === 'yes',
    working: v.working === 'yes',
    hawlMet: v.hawlMet === 'yes',
  };
}

/** "2 bint labūn + 1 ḥiqqah" — the in-kind zakat, short transliterated names. */
export function formatAnimals(animals: AnimalDue[], t: TFunction): string {
  return animals.map((a) => `${a.count} ${t(`livestock.animal.${a.type}`)}`).join(' + ');
}

export function buildLivestockResultView(result: LivestockResult, opts: { t: TFunction }) {
  const { t } = opts;
  const rows: BreakdownRow[] = [
    { label: t('livestock.result.species'), value: t(`livestock.species.${result.species}`) },
    { label: t('livestock.result.herdSize'), value: String(result.count) },
  ];

  if (!result.due) {
    rows.push({
      label: t('livestock.result.ruling'),
      value: t(`livestock.reason.${result.reason}`),
      emphasis: true,
    });
    return {
      // No label above "No Zakat due" — the ruling row below carries the reason.
      headline: t('livestock.result.none'),
      headlineLabel: undefined as string | undefined,
      rows,
      citation: t('livestock.result.citation'),
      disclaimer: t('livestock.result.disclaimer'),
    };
  }

  // One row per due animal, glossed with its age-grade (e.g. "1 ḥiqqah" → "3-yr-old she-camel").
  for (const a of result.animals) {
    rows.push({
      label: `${a.count} ${t(`livestock.animal.${a.type}`)}`,
      value: t(`livestock.gloss.${a.type}`),
    });
  }
  if (result.alternative) {
    rows.push({
      label: t('livestock.result.alternative'),
      value: formatAnimals(result.alternative, t),
    });
  }
  if (result.valuePaymentAllowed) {
    rows.push({ label: t('livestock.result.payment'), value: t('livestock.result.valueAllowed') });
  }

  return {
    headline: formatAnimals(result.animals, t),
    headlineLabel: t('livestock.result.due'),
    rows,
    citation: t('livestock.result.citation'),
    disclaimer: t('livestock.result.disclaimer'),
  };
}
