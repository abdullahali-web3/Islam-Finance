import type { ReactNode } from 'react';
import { View, Text } from 'react-native';

type ScreenHeaderProps = {
  /** Already-translated title (callers pass t('…'), never a literal — ADR 0009 i18n hygiene). */
  title: string;
  subtitle?: string;
  /** Optional right-aligned slot (e.g. an action button). */
  right?: ReactNode;
};

/**
 * Standard screen title block (ADR 0012). Title carries the `header` a11y role so screen readers
 * announce it as a heading. Token-driven, light + dark.
 */
export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  return (
    <View className="mb-6 flex-row items-start justify-between">
      <View className="flex-1 pr-3">
        <Text
          accessibilityRole="header"
          className="text-2xl font-bold text-neutral-900 dark:text-neutral-50"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-300">{subtitle}</Text>
        ) : null}
      </View>
      {right ? <View className="shrink-0">{right}</View> : null}
    </View>
  );
}
