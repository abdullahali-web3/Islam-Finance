import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ErrorStateProps = {
  /** Already-translated error message. */
  message: string;
  title?: string;
  /** Optional retry affordance. */
  retryLabel?: string;
  onRetry?: () => void;
};

/**
 * Shared error state (ADR 0012). Announces via the `alert` role and offers an optional retry.
 * Token-driven, light + dark. Use for recoverable failures (e.g. price fetch failed).
 */
export function ErrorState({ message, title, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <View
      accessibilityRole="alert"
      className="flex-1 items-center justify-center px-8 py-12"
    >
      <Ionicons name="alert-circle-outline" size={40} color="#A97D14" />
      {title ? (
        <Text className="mt-3 text-center text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          {title}
        </Text>
      ) : null}
      <Text className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-300">
        {message}
      </Text>
      {onRetry && retryLabel ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          className="mt-5 min-h-[44px] items-center justify-center rounded-md bg-green-500 px-5 py-2.5 active:opacity-80 dark:bg-green-600"
        >
          <Text className="text-sm font-semibold text-neutral-0">{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
