import { ScrollView, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ResultView, type ResultAction } from '@/components/ResultView';
import { buildUshrResultView } from '@/features/ushr/ushrUi';
import { useHistoryAction } from '@/features/history/useHistoryAction';
import { useUshrStore } from '@/store/ushrStore';

/** ʿUshr result screen (ADR 0006 route: /calculator/ushr/result). */
export default function UshrResultScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const last = useUshrStore((s) => s.last);

  const view = last ? buildUshrResultView(last, { t, locale: i18n.language }) : null;
  const saveAction = useHistoryAction({
    domain: 'ushr',
    titleKey: 'home.card.ushr',
    headline: view?.headline ?? '',
    subtitle: view?.headlineLabel,
  });

  if (!last || !view) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ headerShown: true, title: t('home.card.ushr') }} />
        <EmptyState title={t('ushr.result.emptyTitle')} subtitle={t('ushr.result.emptySubtitle')} />
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
          message: t('ushr.result.shareMessage', { due: view.headline, disclaimer: view.disclaimer }),
        }),
    },
    { label: t('zakat.result.recalculate'), icon: 'refresh-outline', onPress: () => router.back() },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('ushr.result.title') }} />
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
