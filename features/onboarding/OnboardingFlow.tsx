import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18next from '@/locales/i18n';
import { ScreenContainer } from '@/components/ScreenContainer';
import { WizardChrome } from '@/components/WizardChrome';
import { SUPPORTED_CURRENCIES, type CurrencyCode } from '@/core/shared';
import {
  useSettingsStore,
  type Language,
  type Madhab,
} from '@/store/settingsStore';

const STEPS = ['language', 'madhab', 'currency'] as const;

/** Selectable pill, matching the app's option-picker style (Settings, CalculatorForm). */
function Pill({
  label,
  active,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={accessibilityLabel ?? label}
      className={
        active
          ? 'min-h-[44px] items-center justify-center rounded-md bg-green-500 px-4 py-2.5 dark:bg-green-600'
          : 'min-h-[44px] items-center justify-center rounded-md bg-neutral-100 px-4 py-2.5 dark:bg-neutral-700'
      }
    >
      <Text
        className={
          active
            ? 'text-sm font-medium text-neutral-0'
            : 'text-sm font-medium text-neutral-700 dark:text-neutral-100'
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * First-run onboarding (roadmap §1). A short wizard capturing the settings a diaspora user needs
 * before any calculator runs: language, madhab (a conscious choice — no strong default, ADR 0009),
 * and default currency. Built on the shared WizardChrome so it looks like the rest of the app.
 *
 * Location/prayer permission is intentionally deferred to the Phase 1 prayer-times setup, where it
 * has an immediate consumer (requesting it here, with nothing to use it for, is poor UX and hurts
 * store review). Settings are all changeable later in Settings.
 */
export function OnboardingFlow() {
  const { t } = useTranslation();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const { language, madhab, currency, setLanguage, setMadhab, setCurrency, completeOnboarding } =
    useSettingsStore();

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const handleLanguage = (next: Language) => {
    setLanguage(next);
    i18next.changeLanguage(next);
  };

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
      router.replace('/');
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const languageOptions: { key: Language; label: string }[] = [
    { key: 'en', label: t('settings.language.en') },
    { key: 'ur', label: t('settings.language.ur') },
  ];

  const madhabOptions: { key: Madhab; label: string }[] = [
    { key: 'hanafi', label: t('settings.madhab.hanafi') },
    { key: 'shafii', label: t('settings.madhab.shafii') },
    { key: 'maliki', label: t('settings.madhab.maliki') },
    { key: 'hanbali', label: t('settings.madhab.hanbali') },
  ];

  return (
    <ScreenContainer>
      <View className="flex-1 px-4 pt-4 pb-6">
        <Text className="mb-1 text-sm font-medium text-green-500 dark:text-green-100">
          {t('onboarding.welcome')}
        </Text>

        <WizardChrome
          step={stepIndex + 1}
          totalSteps={STEPS.length}
          title={t(`onboarding.${step}.title`)}
          progressLabel={t('wizard.progress', { step: stepIndex + 1, total: STEPS.length })}
          onBack={stepIndex > 0 ? () => setStepIndex((i) => i - 1) : undefined}
          backLabel={t('common.back')}
          onNext={handleNext}
          nextLabel={isLast ? t('onboarding.getStarted') : t('common.next')}
        >
          <Text className="mb-4 text-sm text-neutral-500 dark:text-neutral-300">
            {t(`onboarding.${step}.subtitle`)}
          </Text>

          {step === 'language' ? (
            <View className="flex-row flex-wrap gap-2">
              {languageOptions.map((opt) => (
                <Pill
                  key={opt.key}
                  label={opt.label}
                  active={language === opt.key}
                  onPress={() => handleLanguage(opt.key)}
                />
              ))}
            </View>
          ) : null}

          {step === 'madhab' ? (
            <View className="flex-row flex-wrap gap-2">
              {madhabOptions.map((opt) => (
                <Pill
                  key={opt.key}
                  label={opt.label}
                  active={madhab === opt.key}
                  onPress={() => setMadhab(opt.key)}
                />
              ))}
            </View>
          ) : null}

          {step === 'currency' ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap gap-2">
                {SUPPORTED_CURRENCIES.map((c) => (
                  <Pill
                    key={c.code}
                    label={`${c.code} ${c.symbol}`}
                    accessibilityLabel={c.code}
                    active={currency === (c.code as CurrencyCode)}
                    onPress={() => setCurrency(c.code as CurrencyCode)}
                  />
                ))}
              </View>
            </ScrollView>
          ) : null}
        </WizardChrome>
      </View>
    </ScreenContainer>
  );
}
