import { ScrollView, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ResultView, type ResultAction } from '@/components/ResultView';
import { buildPurificationResultView } from '@/features/purification/purificationUi';
import { useHistoryAction } from '@/features/history/useHistoryAction';
import { usePurificationStore } from '@/store/purificationStore';

/** Investment purification result screen (ADR 0006 route: /calculator/purification/result). */
export default function PurificationResultScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const last = usePurificationStore((s) => s.last);

  const view = last ? buildPurificationResultView(last, { t, locale: i18n.language }) : null;
  const saveAction = useHistoryAction({
    domain: 'purification',
    titleKey: 'home.card.purification',
    headline: view?.headline ?? '',
    subtitle: view?.headlineLabel,
  });

  if (!last || !view) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ headerShown: true, title: t('home.card.purification') }} />
        <EmptyState
          title={t('purification.result.emptyTitle')}
          subtitle={t('purification.result.emptySubtitle')}
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
          message: t('purification.result.shareMessage', {
            amount: view.headline,
            disclaimer: view.disclaimer,
          }),
        }),
    },
    { label: t('zakat.result.recalculate'), icon: 'refresh-outline', onPress: () => router.back() },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('purification.result.title') }} />
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
