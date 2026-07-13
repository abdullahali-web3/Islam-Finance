import { ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { HomeHeader } from '@/features/home/HomeHeader';
import { FavoritesRow } from '@/features/home/FavoritesRow';
import { CalculatorGrid } from '@/features/home/CalculatorGrid';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        {/* Quick access to favorited calculators — hidden until the user favorites one. */}
        <FavoritesRow />

        {/* Calculator hub grid — rendered from the registry (ADR 0006), never hand-wired. */}
        <View className="mt-6">
          <Text className="mb-3 text-sm font-semibold text-neutral-500 dark:text-neutral-300">
            {t('home.calculators')}
          </Text>
          <CalculatorGrid />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
