import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { HomeHeader } from '@/features/home/HomeHeader';

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

        {/* Calculator hub grid — empty until the first calculators land in Phase 1. */}
        <View className="mt-6 min-h-[240px]">
          <EmptyState title={t('home.emptyTitle')} subtitle={t('home.emptySubtitle')} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
