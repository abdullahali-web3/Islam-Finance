import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store/settingsStore';
import { getCalculator } from './registry';

/**
 * Horizontal favorites row on the home hub (ADR 0006). Renders the user's favorited calculators
 * (enabled ones only) as quick-access chips. Hidden entirely when there are no usable favorites, so
 * it takes no vertical space until the user favorites something.
 */
export function FavoritesRow() {
  const { t } = useTranslation();
  const router = useRouter();
  const favorites = useSettingsStore((s) => s.favorites);

  const items = favorites
    .map((id) => getCalculator(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined && c.enabled);

  if (items.length === 0) return null;

  return (
    <View className="mt-6">
      <Text className="mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-300">
        {t('home.favorites')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push(item.route)}
            accessibilityRole="button"
            accessibilityLabel={t(item.titleKey)}
            className="min-h-[44px] flex-row items-center gap-2 rounded-md border border-neutral-100 bg-neutral-0 px-4 py-2.5 active:opacity-80 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <Ionicons name={item.icon} size={16} color="#1B5E20" />
            <Text className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
              {t(item.titleKey)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
