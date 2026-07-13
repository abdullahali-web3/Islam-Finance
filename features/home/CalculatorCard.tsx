import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/Card';
import { useSettingsStore } from '@/store/settingsStore';
import type { CalculatorDescriptor } from './registry';

/**
 * One calculator tile on the home hub, rendered from a registry descriptor (ADR 0006). Enabled
 * cards navigate to the calculator's deep-linkable route and expose a favorite toggle; disabled
 * cards render a dimmed "coming soon" badge and don't navigate.
 */
export function CalculatorCard({ item }: { item: CalculatorDescriptor }) {
  const { t } = useTranslation();
  const router = useRouter();
  const isFavorite = useSettingsStore((s) => s.favorites.includes(item.id));
  const toggleFavorite = useSettingsStore((s) => s.toggleFavorite);

  const title = t(item.titleKey);

  if (!item.enabled) {
    return (
      <Card className="opacity-60">
        <Ionicons name={item.icon} size={24} color="#8A8A85" />
        <Text className="mt-2 text-base font-semibold text-neutral-900 dark:text-neutral-50">
          {title}
        </Text>
        <Text className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-300">
          {t('home.comingSoon')}
        </Text>
      </Card>
    );
  }

  return (
    <Card onPress={() => router.push(item.route)} accessibilityLabel={title}>
      <View className="flex-row items-start justify-between">
        <Ionicons name={item.icon} size={24} color="#1B5E20" />
        <Pressable
          onPress={() => toggleFavorite(item.id)}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? t('home.unfavorite') : t('home.favorite')}
          hitSlop={12}
          className="min-h-[44px] min-w-[44px] items-end"
        >
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={20}
            color={isFavorite ? '#C9971F' : '#8A8A85'}
          />
        </Pressable>
      </View>
      <Text className="mt-2 text-base font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
      </Text>
    </Card>
  );
}
