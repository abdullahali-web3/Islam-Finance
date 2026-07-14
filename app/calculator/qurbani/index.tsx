import { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CalculatorForm } from '@/components/CalculatorForm';
import { calculateQurbani, getRuleModule } from '@/core/qurbani';
import {
  makeQurbaniSchema,
  qurbaniDefaultValues,
  type QurbaniFormValues,
} from '@/schemas/qurbani.schema';
import { buildQurbaniFields, toQurbaniInput } from '@/features/qurbani/qurbaniUi';
import { useSettingsStore } from '@/store/settingsStore';
import { useQurbaniStore } from '@/store/qurbaniStore';

/** Qurbani input screen (ADR 0006 route: /calculator/qurbani). */
export default function QurbaniInputScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const madhab = useSettingsStore((s) => s.madhab);
  const currency = useSettingsStore((s) => s.currency);
  const setLast = useQurbaniStore((s) => s.setLast);

  const schema = useMemo(
    () =>
      makeQurbaniSchema({
        amount: t('qurbani.err.amount'),
        integer: t('qurbani.err.integer'),
        minPeople: t('qurbani.err.minPeople'),
        priceRequired: t('qurbani.err.priceRequired'),
      }),
    [t]
  );
  const fields = useMemo(() => buildQurbaniFields(t), [t]);

  const onSubmit = (values: QurbaniFormValues) => {
    const result = calculateQurbani(toQurbaniInput(values, { currency }), getRuleModule(madhab));
    setLast(result);
    router.push('/calculator/qurbani/result');
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.qurbani') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader title={t('home.card.qurbani')} subtitle={t('qurbani.inputSubtitle', { currency })} />
        <View className="mb-4 rounded-md bg-neutral-100 px-3 py-2.5 dark:bg-neutral-700">
          <Text className="text-xs leading-5 text-neutral-700 dark:text-neutral-100">
            {t('qurbani.hint', { madhab: t(`settings.madhab.${madhab}`) })}
          </Text>
        </View>
        <CalculatorForm
          schema={schema}
          fields={fields}
          defaultValues={qurbaniDefaultValues}
          submitLabel={t('qurbani.calculate')}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
