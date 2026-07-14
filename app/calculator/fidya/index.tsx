import { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CalculatorForm } from '@/components/CalculatorForm';
import { calculateExpiation } from '@/core/fidya';
import { makeFidyaSchema, fidyaDefaultValues, type FidyaFormValues } from '@/schemas/fidya.schema';
import { buildFidyaFields, toFidyaInput } from '@/features/fidya/fidyaUi';
import { useSettingsStore } from '@/store/settingsStore';
import { useFidyaStore } from '@/store/fidyaStore';

/** Fidya & Kaffarah input screen (ADR 0006 route: /calculator/fidya). */
export default function FidyaInputScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const currency = useSettingsStore((s) => s.currency);
  const setLast = useFidyaStore((s) => s.setLast);

  const schema = useMemo(
    () =>
      makeFidyaSchema({
        amount: t('fidya.err.amount'),
        integer: t('fidya.err.integer'),
        minDays: t('fidya.err.minDays'),
        priceRequired: t('fidya.err.priceRequired'),
      }),
    [t]
  );
  const fields = useMemo(() => buildFidyaFields(t), [t]);

  const onSubmit = (values: FidyaFormValues) => {
    setLast(calculateExpiation(toFidyaInput(values, { currency })));
    router.push('/calculator/fidya/result');
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.fidya') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader title={t('home.card.fidya')} subtitle={t('fidya.inputSubtitle', { currency })} />
        <View className="mb-4 rounded-md bg-neutral-100 px-3 py-2.5 dark:bg-neutral-700">
          <Text className="text-xs leading-5 text-neutral-700 dark:text-neutral-100">
            {t('fidya.hint')}
          </Text>
        </View>
        <CalculatorForm
          schema={schema}
          fields={fields}
          defaultValues={fidyaDefaultValues}
          submitLabel={t('fidya.calculate')}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
