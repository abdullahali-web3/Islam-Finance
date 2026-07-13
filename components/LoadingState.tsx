import { View, Text, ActivityIndicator } from 'react-native';

type LoadingStateProps = {
  /** Optional already-translated label announced to screen readers. */
  label?: string;
};

/**
 * Shared loading state (ADR 0012). Centered spinner with an optional label; the whole block is a
 * single a11y node so screen readers announce "loading" rather than the spinner alone.
 */
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      className="flex-1 items-center justify-center px-8 py-12"
    >
      <ActivityIndicator color="#1B5E20" />
      {label ? (
        <Text className="mt-3 text-sm text-neutral-500 dark:text-neutral-300">{label}</Text>
      ) : null}
    </View>
  );
}
