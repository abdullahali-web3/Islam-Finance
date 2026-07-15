import { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CalculatorForm } from '@/components/CalculatorForm';
import { calculateLivestock, getRuleModule } from '@/core/livestock';
import {
  makeLivestockSchema,
  livestockDefaultValues,
  type LivestockFormValues,
} from '@/schemas/livestock.schema';
import { buildLivestockFields, toLivestockInput } from '@/features/livestock/livestockUi';
import { useSettingsStore } from '@/store/settingsStore';
import { useLivestockStore } from '@/store/livestockStore';

/** Livestock (Zakāt al-Anʿām) input screen (ADR 0006 route: /calculator/livestock). */
export default function LivestockInputScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const madhab = useSettingsStore((s) => s.madhab);
  const setLast = useLivestockStore((s) => s.setLast);

  const schema = useMemo(
    () =>
      makeLivestockSchema({
        integer: t('livestock.err.integer'),
        minCount: t('livestock.err.minCount'),
        maxCount: t('livestock.err.maxCount'),
      }),
    [t]
  );
  const fields = useMemo(() => buildLivestockFields(t), [t]);

  const onSubmit = (values: LivestockFormValues) => {
    const result = calculateLivestock(toLivestockInput(values), getRuleModule(madhab));
    setLast(result);
    router.push('/calculator/livestock/result');
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.livestock') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader title={t('home.card.livestock')} subtitle={t('livestock.inputSubtitle')} />
        <View className="mb-4 rounded-md bg-neutral-100 px-3 py-2.5 dark:bg-neutral-700">
          <Text className="text-xs leading-5 text-neutral-700 dark:text-neutral-100">
            {t('livestock.hint', { madhab: t(`settings.madhab.${madhab}`) })}
          </Text>
        </View>
        <CalculatorForm
          schema={schema}
          fields={fields}
          defaultValues={livestockDefaultValues}
          submitLabel={t('livestock.calculate')}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
