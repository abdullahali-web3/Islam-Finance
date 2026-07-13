import type { ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';

type WizardChromeProps = {
  /** 1-based current step. */
  step: number;
  totalSteps: number;
  /** Already-translated step title. */
  title: string;
  /** A11y label for the progress bar, e.g. t('wizard.progress', { step, total }). */
  progressLabel: string;
  children: ReactNode;
  onNext: () => void;
  nextLabel: string;
  onBack?: () => void;
  backLabel?: string;
};

/**
 * Wizard step chrome (ADR 0012): progress indicator + step title + a Back/Next footer, wrapping the
 * step's fields. Calculators render each wizard step inside this so multi-step flows look identical
 * across the app. Token-driven, light + dark; the progress bar is non-text with an a11y label.
 */
export function WizardChrome({
  step,
  totalSteps,
  title,
  progressLabel,
  children,
  onNext,
  nextLabel,
  onBack,
  backLabel,
}: WizardChromeProps) {
  return (
    <View className="flex-1">
      {/* Progress segments */}
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={progressLabel}
        className="mb-5 flex-row gap-1.5"
      >
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            className={
              i < step
                ? 'h-1.5 flex-1 rounded-sm bg-green-500 dark:bg-green-600'
                : 'h-1.5 flex-1 rounded-sm bg-neutral-100 dark:bg-neutral-700'
            }
          />
        ))}
      </View>

      <Text
        accessibilityRole="header"
        className="mb-4 text-xl font-bold text-neutral-900 dark:text-neutral-50"
      >
        {title}
      </Text>

      <View className="flex-1">{children}</View>

      {/* Footer nav */}
      <View className="mt-6 flex-row gap-3">
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            className="min-h-[44px] flex-1 items-center justify-center rounded-md border border-neutral-100 px-4 py-3 active:opacity-80 dark:border-neutral-700"
          >
            <Text className="text-base font-semibold text-neutral-700 dark:text-neutral-100">
              {backLabel}
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel={nextLabel}
          className="min-h-[44px] flex-1 items-center justify-center rounded-md bg-green-500 px-4 py-3 active:opacity-80 dark:bg-green-600"
        >
          <Text className="text-base font-semibold text-neutral-0">{nextLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}
