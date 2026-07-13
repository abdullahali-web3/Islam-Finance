import { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CalculatorForm } from '@/components/CalculatorForm';
import { calculateZakat, getRuleModule } from '@/core/zakat';
import {
  makeZakatSchema,
  zakatDefaultValues,
  type ZakatFormValues,
} from '@/schemas/zakat.schema';
import { buildZakatFields } from '@/features/zakat/fields';
import { toZakatInput } from '@/features/zakat/toZakatInput';
import { getManualOverride, setManualOverride } from '@/services/priceProxy';
import { useSettingsStore } from '@/store/settingsStore';
import { useZakatStore } from '@/store/zakatStore';

/**
 * Zakat input screen (ADR 0006 route: /calculator/zakat). Renders the generic <CalculatorForm/> from
 * the Zakat schema (ADR 0001), computes with the engine using the user's madhab + nisab basis, stores
 * the result, and routes to the result screen. Not scholar-verified yet — the result screen carries
 * the provisional disclaimer (ADR 0013). Metal prices the user types are cached locally (MMKV, no
 * network — ADR 0008 manual override) and prefilled next time.
 */
export default function ZakatInputScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const madhab = useSettingsStore((s) => s.madhab);
  const currency = useSettingsStore((s) => s.currency);
  const nisabBasis = useSettingsStore((s) => s.nisabBasis);
  const setLast = useZakatStore((s) => s.setLast);

  const schema = useMemo(
    () =>
      makeZakatSchema(nisabBasis, {
        amount: t('zakat.err.amount'),
        nonnegative: t('zakat.err.nonnegative'),
        goldPrice: t('zakat.err.goldPrice'),
        silverPrice: t('zakat.err.silverPrice'),
      }),
    [nisabBasis, t]
  );

  const fields = useMemo(() => buildZakatFields(t), [t]);

  // Prefill the metal prices from the locally-cached manual override (same currency only), so the
  // user doesn't retype today's prices on every calculation. Local read only — never a network call.
  const defaultValues = useMemo<ZakatFormValues>(() => {
    const override = getManualOverride();
    if (override && override.currency === currency) {
      return {
        ...zakatDefaultValues,
        goldPricePerGram: override.goldPerGram,
        silverPricePerGram: override.silverPerGram,
      };
    }
    return zakatDefaultValues;
  }, [currency]);

  const onSubmit = (values: ZakatFormValues) => {
    const input = toZakatInput(values, { currency, nisabBasis });
    const result = calculateZakat(input, getRuleModule(madhab));

    // Persist the entered prices locally for next time (no network; ADR 0008 manual override).
    if (values.goldPricePerGram > 0 && values.silverPricePerGram > 0) {
      setManualOverride({
        goldPerGram: values.goldPricePerGram,
        silverPerGram: values.silverPricePerGram,
        currency,
        asOf: new Date().toISOString(),
      });
    }

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

        {/* Instructional hint (not an offline/alert state — a plain info note). */}
        <View className="mb-4 rounded-md bg-neutral-100 px-3 py-2.5 dark:bg-neutral-700">
          <Text className="text-xs leading-5 text-neutral-700 dark:text-neutral-100">
            {t('zakat.priceHint')}
          </Text>
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
          defaultValues={defaultValues}
          submitLabel={t('zakat.calculate')}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
