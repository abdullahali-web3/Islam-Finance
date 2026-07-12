import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

/**
 * Placeholder "live" home header. In Phase 1 this becomes the real live header
 * (next prayer time, Hijri date, Zakat haul countdown). For now it establishes the
 * layout slot at the top of the home hub.
 */
export function HomeHeader() {
  const { t } = useTranslation();

  return (
    <View className="rounded-lg bg-green-500 px-5 py-6 dark:bg-green-700">
      <Text className="text-sm font-medium text-green-100">{t('home.headerGreeting')}</Text>
      <Text className="mt-1 text-2xl font-bold text-neutral-0">{t('app.name')}</Text>
      <Text className="mt-3 text-xs text-green-100">{t('home.headerPlaceholder')}</Text>
    </View>
  );
}
