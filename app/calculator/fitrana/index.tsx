import { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CalculatorForm } from '@/components/CalculatorForm';
import { calculateFitrana, getRuleModule } from '@/core/fitrana';
import {
  makeFitranaSchema,
  fitranaDefaultValues,
  type FitranaFormValues,
} from '@/schemas/fitrana.schema';
import { buildFitranaFields, toFitranaInput } from '@/features/fitrana/fitranaUi';
import { useSettingsStore } from '@/store/settingsStore';
import { useFitranaStore } from '@/store/fitranaStore';

/** Fitrana input screen (ADR 0006 route: /calculator/fitrana). */
export default function FitranaInputScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const madhab = useSettingsStore((s) => s.madhab);
  const currency = useSettingsStore((s) => s.currency);
  const setLast = useFitranaStore((s) => s.setLast);

  const schema = useMemo(
    () =>
      makeFitranaSchema({
        amount: t('fitrana.err.amount'),
        integer: t('fitrana.err.integer'),
        minPeople: t('fitrana.err.minPeople'),
        perPersonRequired: t('fitrana.err.perPersonRequired'),
        priceRequired: t('fitrana.err.priceRequired'),
      }),
    [t]
  );
  const fields = useMemo(() => buildFitranaFields(t), [t]);

  const onSubmit = (values: FitranaFormValues) => {
    const result = calculateFitrana(toFitranaInput(values, { currency }), getRuleModule(madhab));
    setLast(result);
    router.push('/calculator/fitrana/result');
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.fitrana') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader title={t('home.card.fitrana')} subtitle={t('fitrana.inputSubtitle', { currency })} />
        <View className="mb-4 rounded-md bg-neutral-100 px-3 py-2.5 dark:bg-neutral-700">
          <Text className="text-xs leading-5 text-neutral-700 dark:text-neutral-100">
            {t('fitrana.hint')}
          </Text>
        </View>
        <CalculatorForm
          schema={schema}
          fields={fields}
          defaultValues={fitranaDefaultValues}
          submitLabel={t('fitrana.calculate')}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
