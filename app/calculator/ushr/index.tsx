import { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CalculatorForm } from '@/components/CalculatorForm';
import { calculateUshr, getRuleModule } from '@/core/ushr';
import { makeUshrSchema, ushrDefaultValues, type UshrFormValues } from '@/schemas/ushr.schema';
import { buildUshrFields, toUshrInput } from '@/features/ushr/ushrUi';
import { useSettingsStore } from '@/store/settingsStore';
import { useUshrStore } from '@/store/ushrStore';

/** ʿUshr input screen (ADR 0006 route: /calculator/ushr). */
export default function UshrInputScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const madhab = useSettingsStore((s) => s.madhab);
  const currency = useSettingsStore((s) => s.currency);
  const setLast = useUshrStore((s) => s.setLast);

  const schema = useMemo(
    () => makeUshrSchema({ amount: t('ushr.err.amount'), harvestRequired: t('ushr.err.harvestRequired') }),
    [t]
  );
  const fields = useMemo(() => buildUshrFields(t), [t]);

  const onSubmit = (values: UshrFormValues) => {
    const result = calculateUshr(toUshrInput(values, { currency }), getRuleModule(madhab));
    setLast(result);
    router.push('/calculator/ushr/result');
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.ushr') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader title={t('home.card.ushr')} subtitle={t('ushr.inputSubtitle')} />
        <View className="mb-4 rounded-md bg-neutral-100 px-3 py-2.5 dark:bg-neutral-700">
          <Text className="text-xs leading-5 text-neutral-700 dark:text-neutral-100">
            {t('ushr.hint', { madhab: t(`settings.madhab.${madhab}`) })}
          </Text>
        </View>
        <CalculatorForm
          schema={schema}
          fields={fields}
          defaultValues={ushrDefaultValues}
          submitLabel={t('ushr.calculate')}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
