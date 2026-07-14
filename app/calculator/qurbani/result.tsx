import { ScrollView, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ResultView, type ResultAction } from '@/components/ResultView';
import { buildQurbaniResultView } from '@/features/qurbani/qurbaniUi';
import { useQurbaniStore } from '@/store/qurbaniStore';

/** Qurbani result screen (ADR 0006 route: /calculator/qurbani/result). */
export default function QurbaniResultScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const last = useQurbaniStore((s) => s.last);

  if (!last) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ headerShown: true, title: t('home.card.qurbani') }} />
        <EmptyState title={t('qurbani.result.emptyTitle')} subtitle={t('qurbani.result.emptySubtitle')} />
      </ScreenContainer>
    );
  }

  const view = buildQurbaniResultView(last, { t, locale: i18n.language });
  const actions: ResultAction[] = [
    {
      label: t('common.share'),
      icon: 'share-outline',
      onPress: () =>
        Share.share({
          message: t('qurbani.result.shareMessage', {
            ruling: t(`qurbani.status.${last.status}`),
            cost: view.headline,
            disclaimer: view.disclaimer,
          }),
        }),
    },
    { label: t('zakat.result.recalculate'), icon: 'refresh-outline', onPress: () => router.back() },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('qurbani.result.title') }} />
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
