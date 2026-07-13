import { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { OfflineNotice } from '@/components/OfflineNotice';
import { CalculatorForm } from '@/components/CalculatorForm';
import { calculateZakat, getRuleModule } from '@/core/zakat';
import { makeZakatSchema, zakatDefaultValues, type ZakatFormValues } from '@/schemas/zakat.schema';
import { buildZakatFields } from '@/features/zakat/fields';
import { toZakatInput } from '@/features/zakat/toZakatInput';
import { useSettingsStore } from '@/store/settingsStore';
import { useZakatStore } from '@/store/zakatStore';

/**
 * Zakat input screen (ADR 0006 route: /calculator/zakat). Renders the generic <CalculatorForm/> from
 * the Zakat schema (ADR 0001), computes with the engine using the user's madhab + nisab basis, stores
 * the result, and routes to the result screen. Not scholar-verified yet — the result screen carries
 * the provisional disclaimer (ADR 0013).
 */
export default function ZakatInputScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const madhab = useSettingsStore((s) => s.madhab);
  const currency = useSettingsStore((s) => s.currency);
  const nisabBasis = useSettingsStore((s) => s.nisabBasis);
  const setLast = useZakatStore((s) => s.setLast);

  const schema = useMemo(() => makeZakatSchema(nisabBasis), [nisabBasis]);
  const fields = useMemo(() => buildZakatFields(t), [t]);

  const onSubmit = (values: ZakatFormValues) => {
    const input = toZakatInput(values, { currency, nisabBasis });
    const result = calculateZakat(input, getRuleModule(madhab));
    setLast({ input, result, madhab });
    router.push('/calculator/zakat/result');
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.zakat') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader
          title={t('home.card.zakat')}
          subtitle={t('zakat.inputSubtitle', { currency })}
        />

        <View className="mb-4">
          <OfflineNotice message={t('zakat.priceHint')} />
        </View>

        <Text className="mb-5 text-xs text-neutral-500 dark:text-neutral-300">
          {t('zakat.settingsHint', {
            madhab: t(`settings.madhab.${madhab}`),
            basis: t(`settings.nisabBasis.${nisabBasis}`),
          })}
        </Text>

        <CalculatorForm
          schema={schema}
          fields={fields}
          defaultValues={zakatDefaultValues}
          submitLabel={t('zakat.calculate')}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
