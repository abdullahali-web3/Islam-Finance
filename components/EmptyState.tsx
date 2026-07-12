import { View, Text } from 'react-native';

type EmptyStateProps = {
  title: string;
  subtitle?: string;
};

/** Shared empty-state block used by screens with no content yet (home hub, learn, history). */
export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="text-center text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-300">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
