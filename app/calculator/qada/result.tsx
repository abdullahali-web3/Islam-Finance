import { ScrollView, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ResultView, type ResultAction } from '@/components/ResultView';
import { buildQadaResultView } from '@/features/qada/qadaUi';
import { useHistoryAction } from '@/features/history/useHistoryAction';
import { useQadaStore } from '@/store/qadaStore';

/** Qaḍāʾ result screen (ADR 0006 route: /calculator/qada/result). */
export default function QadaResultScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const last = useQadaStore((s) => s.last);

  const view = last ? buildQadaResultView(last, { t }) : null;
  const saveAction = useHistoryAction({
    domain: 'qada',
    titleKey: 'home.card.qada',
    headline: view?.headline ?? '',
    subtitle: view?.headlineLabel,
  });

  if (!last || !view) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ headerShown: true, title: t('home.card.qada') }} />
        <EmptyState title={t('qada.result.emptyTitle')} subtitle={t('qada.result.emptySubtitle')} />
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
          message: t('qada.result.shareMessage', { due: view.headline, disclaimer: view.disclaimer }),
        }),
    },
    { label: t('zakat.result.recalculate'), icon: 'refresh-outline', onPress: () => router.back() },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('qada.result.title') }} />
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
