import { ScrollView, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ResultView, type ResultAction } from '@/components/ResultView';
import { buildLivestockResultView } from '@/features/livestock/livestockUi';
import { useHistoryAction } from '@/features/history/useHistoryAction';
import { useLivestockStore } from '@/store/livestockStore';

/** Livestock result screen (ADR 0006 route: /calculator/livestock/result). */
export default function LivestockResultScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const last = useLivestockStore((s) => s.last);

  const view = last ? buildLivestockResultView(last, { t }) : null;
  const saveAction = useHistoryAction({
    domain: 'livestock',
    titleKey: 'home.card.livestock',
    headline: view?.headline ?? '',
    subtitle: view?.headlineLabel,
  });

  if (!last || !view) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ headerShown: true, title: t('home.card.livestock') }} />
        <EmptyState
          title={t('livestock.result.emptyTitle')}
          subtitle={t('livestock.result.emptySubtitle')}
        />
      </ScreenContainer>
    );
  }

  const actions: ResultAction[] = [
    saveAction,
    {
      label: t('common.share'),
      icon: 'share-outline',
      onPress: () =>
        Share.share({
          message: t('livestock.result.shareMessage', {
            due: view.headline,
            disclaimer: view.disclaimer,
          }),
        }),
    },
    { label: t('zakat.result.recalculate'), icon: 'refresh-outline', onPress: () => router.back() },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('livestock.result.title') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ResultView
          headline={view.headline}
          headlineLabel={view.headlineLabel}
          rows={view.rows}
          citation={view.citation}
          disclaimer={view.disclaimer}
          actions={actions}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
