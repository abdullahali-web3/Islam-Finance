import { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CalculatorForm } from '@/components/CalculatorForm';
import { calculateQada, getRuleModule } from '@/core/qada';
import { makeQadaSchema, qadaDefaultValues, type QadaFormValues } from '@/schemas/qada.schema';
import { buildQadaFields, toQadaInput } from '@/features/qada/qadaUi';
import { useSettingsStore } from '@/store/settingsStore';
import { useQadaStore } from '@/store/qadaStore';

/** Qaḍāʾ (missed prayers & fasts) input screen (ADR 0006 route: /calculator/qada). */
export default function QadaInputScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const madhab = useSettingsStore((s) => s.madhab);
  const setLast = useQadaStore((s) => s.setLast);

  const schema = useMemo(
    () =>
      makeQadaSchema({
        amount: t('qada.err.amount'),
        integer: t('qada.err.integer'),
        minPeriod: t('qada.err.minPeriod'),
        minFasts: t('qada.err.minFasts'),
      }),
    [t]
  );
  const fields = useMemo(() => buildQadaFields(t), [t]);

  const onSubmit = (values: QadaFormValues) => {
    const result = calculateQada(toQadaInput(values), getRuleModule(madhab));
    setLast(result);
    router.push('/calculator/qada/result');
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.qada') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader title={t('home.card.qada')} subtitle={t('qada.inputSubtitle')} />
        <View className="mb-4 rounded-md bg-neutral-100 px-3 py-2.5 dark:bg-neutral-700">
          <Text className="text-xs leading-5 text-neutral-700 dark:text-neutral-100">
            {t('qada.hint', { madhab: t(`settings.madhab.${madhab}`) })}
          </Text>
        </View>
        <CalculatorForm
          schema={schema}
          fields={fields}
          defaultValues={qadaDefaultValues}
          submitLabel={t('qada.calculate')}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
