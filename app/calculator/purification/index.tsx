import { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CalculatorForm } from '@/components/CalculatorForm';
import { calculatePurification } from '@/core/purification';
import {
  makePurificationSchema,
  purificationDefaultValues,
  type PurificationFormValues,
} from '@/schemas/purification.schema';
import { buildPurificationFields, toPurificationInput } from '@/features/purification/purificationUi';
import { useSettingsStore } from '@/store/settingsStore';
import { usePurificationStore } from '@/store/purificationStore';

/** Investment purification input screen (ADR 0006 route: /calculator/purification). */
export default function PurificationInputScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const currency = useSettingsStore((s) => s.currency);
  const setLast = usePurificationStore((s) => s.setLast);

  const schema = useMemo(
    () =>
      makePurificationSchema({
        amount: t('purification.err.amount'),
        percentage: t('purification.err.percentage'),
        dividendRequired: t('purification.err.dividendRequired'),
        sharesRequired: t('purification.err.sharesRequired'),
      }),
    [t]
  );
  const fields = useMemo(() => buildPurificationFields(t), [t]);

  const onSubmit = (values: PurificationFormValues) => {
    const result = calculatePurification(toPurificationInput(values, { currency }));
    setLast(result);
    router.push('/calculator/purification/result');
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.purification') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader
          title={t('home.card.purification')}
          subtitle={t('purification.inputSubtitle', { currency })}
        />
        <View className="mb-4 rounded-md bg-neutral-100 px-3 py-2.5 dark:bg-neutral-700">
          <Text className="text-xs leading-5 text-neutral-700 dark:text-neutral-100">
            {t('purification.hint')}
          </Text>
        </View>
        <CalculatorForm
          schema={schema}
          fields={fields}
          defaultValues={purificationDefaultValues}
          submitLabel={t('purification.calculate')}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
