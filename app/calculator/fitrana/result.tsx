import { ScrollView, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ResultView, type ResultAction } from '@/components/ResultView';
import { buildFitranaResultView } from '@/features/fitrana/fitranaUi';
import { useHistoryAction } from '@/features/history/useHistoryAction';
import { useFitranaStore } from '@/store/fitranaStore';

/** Fitrana result screen (ADR 0006 route: /calculator/fitrana/result). */
export default function FitranaResultScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const last = useFitranaStore((s) => s.last);

  const view = last ? buildFitranaResultView(last, { t, locale: i18n.language }) : null;
  const saveAction = useHistoryAction({
    domain: 'fitrana',
    titleKey: 'home.card.fitrana',
    headline: view?.headline ?? '',
    subtitle: view?.headlineLabel,
  });

  if (!last || !view) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ headerShown: true, title: t('home.card.fitrana') }} />
        <EmptyState title={t('fitrana.result.emptyTitle')} subtitle={t('fitrana.result.emptySubtitle')} />
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
          message: t('fitrana.result.shareMessage', { total: view.headline, disclaimer: view.disclaimer }),
        }),
    },
    { label: t('zakat.result.recalculate'), icon: 'refresh-outline', onPress: () => router.back() },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('fitrana.result.title') }} />
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
