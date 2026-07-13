import { useMemo, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CalculatorForm } from '@/components/CalculatorForm';
import { distributeInheritance, getRuleModule, UnsupportedInheritanceCase } from '@/core/inheritance';
import {
  makeInheritanceSchema,
  inheritanceDefaultValues,
  type InheritanceFormValues,
} from '@/schemas/inheritance.schema';
import { buildInheritanceFields } from '@/features/inheritance/fields';
import { toInheritanceInput } from '@/features/inheritance/toInheritanceInput';
import { useSettingsStore } from '@/store/settingsStore';
import { useInheritanceStore } from '@/store/inheritanceStore';

/**
 * Inheritance input screen (ADR 0006 route: /calculator/inheritance). Generic <CalculatorForm/> from
 * the schema (ADR 0001); computes with the Farāʾiḍ engine using the user's madhab. Combinations the
 * V1 engine guards throw UnsupportedInheritanceCase, which is shown as an inline notice (never a
 * wrong distribution). Not scholar-verified yet — the result screen carries the disclaimer (ADR 0013).
 */
export default function InheritanceInputScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const madhab = useSettingsStore((s) => s.madhab);
  const currency = useSettingsStore((s) => s.currency);
  const setLast = useInheritanceStore((s) => s.setLast);
  const [unsupported, setUnsupported] = useState(false);

  const schema = useMemo(
    () =>
      makeInheritanceSchema({
        amount: t('inheritance.err.amount'),
        nonnegative: t('inheritance.err.nonnegative'),
        integer: t('inheritance.err.integer'),
        estatePositive: t('inheritance.err.estatePositive'),
        spouseConflict: t('inheritance.err.spouseConflict'),
        noHeirs: t('inheritance.err.noHeirs'),
      }),
    [t]
  );

  const fields = useMemo(() => buildInheritanceFields(t), [t]);

  const onSubmit = (values: InheritanceFormValues) => {
    const input = toInheritanceInput(values, { currency });
    try {
      const result = distributeInheritance(input, getRuleModule(madhab));
      setUnsupported(false);
      setLast({ input, result, madhab });
      router.push('/calculator/inheritance/result');
    } catch (e) {
      if (e instanceof UnsupportedInheritanceCase) {
        setUnsupported(true);
      } else {
        throw e;
      }
    }
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.inheritance') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader
          title={t('home.card.inheritance')}
          subtitle={t('inheritance.inputSubtitle', { currency })}
        />

        <View className="mb-4 rounded-md bg-neutral-100 px-3 py-2.5 dark:bg-neutral-700">
          <Text className="text-xs leading-5 text-neutral-700 dark:text-neutral-100">
            {t('inheritance.estateHint')}
          </Text>
        </View>

        {unsupported ? (
          <View
            accessibilityRole="alert"
            className="mb-4 rounded-md border border-gold-500 bg-gold-100 px-3 py-2.5"
          >
            <Text className="text-xs leading-5 text-gold-600">
              {t('inheritance.unsupported')}
            </Text>
          </View>
        ) : null}

        <Text className="mb-5 text-xs text-neutral-500 dark:text-neutral-300">
          {t('inheritance.settingsHint', { madhab: t(`settings.madhab.${madhab}`) })}
        </Text>

        <CalculatorForm
          schema={schema}
          fields={fields}
          defaultValues={inheritanceDefaultValues}
          submitLabel={t('inheritance.calculate')}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
