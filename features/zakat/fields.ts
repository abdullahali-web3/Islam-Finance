import type { TFunction } from 'i18next';
import type { FieldConfig } from '@/components/CalculatorForm';
import type { ZakatFormValues } from '@/schemas/zakat.schema';

/**
 * Declarative field list for the Zakat form (ADR 0001). Labels come through i18n (`t`), so the
 * generic <CalculatorForm/> renders the whole calculator without a hand-built screen. Ordered by
 * category (cash → gold → silver → business → haul); the labels carry the grouping.
 */
export function buildZakatFields(t: TFunction): FieldConfig<ZakatFormValues>[] {
  const num = (name: keyof ZakatFormValues): FieldConfig<ZakatFormValues> => ({
    name,
    label: t(`zakat.field.${name}`),
    type: 'number',
    placeholder: '0',
  });

  return [
    num('cash'),
    num('personalDebtsDue'),
    num('goldGramsInvestment'),
    num('goldGramsJewelry'),
    num('goldPricePerGram'),
    num('silverGramsInvestment'),
    num('silverGramsJewelry'),
    num('silverPricePerGram'),
    num('businessInventoryValue'),
    num('businessCash'),
    num('businessReceivablesDue'),
    num('businessLiabilitiesDue'),
    {
      name: 'haulComplete',
      label: t('zakat.field.haulComplete'),
      type: 'select',
      options: [
        { value: 'yes', label: t('common.yes') },
        { value: 'no', label: t('common.no') },
      ],
    },
  ];
}
