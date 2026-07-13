import type { TFunction } from 'i18next';
import type { FieldConfig } from '@/components/CalculatorForm';
import type { InheritanceFormValues } from '@/schemas/inheritance.schema';

/**
 * Field list for the Inheritance form (ADR 0001) — one generic <CalculatorForm/>, no hand-built
 * screen. Booleans are yes/no selects; heir counts are numbers. Ordered by family group; the labels
 * carry the grouping. i18n labels via `t`.
 */
export function buildInheritanceFields(t: TFunction): FieldConfig<InheritanceFormValues>[] {
  const count = (name: keyof InheritanceFormValues): FieldConfig<InheritanceFormValues> => ({
    name,
    label: t(`inheritance.field.${name}`),
    type: 'number',
    placeholder: '0',
  });
  const yesno = (name: keyof InheritanceFormValues): FieldConfig<InheritanceFormValues> => ({
    name,
    label: t(`inheritance.field.${name}`),
    type: 'select',
    options: [
      { value: 'no', label: t('common.no') },
      { value: 'yes', label: t('common.yes') },
    ],
  });

  return [
    count('estate'),
    yesno('husband'),
    count('wives'),
    yesno('father'),
    yesno('mother'),
    count('sons'),
    count('daughters'),
    count('sonsSons'),
    count('sonsDaughters'),
    yesno('paternalGrandfather'),
    yesno('paternalGrandmother'),
    yesno('maternalGrandmother'),
    count('fullBrothers'),
    count('fullSisters'),
    count('paternalBrothers'),
    count('paternalSisters'),
    count('maternalSiblings'),
  ];
}
