import { ScrollView, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ResultView, type ResultAction } from '@/components/ResultView';
import { buildFidyaResultView } from '@/features/fidya/fidyaUi';
import { useFidyaStore } from '@/store/fidyaStore';

/** Fidya & Kaffarah result screen (ADR 0006 route: /calculator/fidya/result). */
export default function FidyaResultScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const last = useFidyaStore((s) => s.last);

  if (!last) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ headerShown: true, title: t('home.card.fidya') }} />
        <EmptyState title={t('fidya.result.emptyTitle')} subtitle={t('fidya.result.emptySubtitle')} />
      </ScreenContainer>
    );
  }

  const view = buildFidyaResultView(last, { t, locale: i18n.language });
  const actions: ResultAction[] = [
    {
      label: t('common.share'),
      icon: 'share-outline',
      onPress: () =>
        Share.share({
          message: t('fidya.result.shareMessage', { total: view.headline, disclaimer: view.disclaimer }),
        }),
    },
    { label: t('zakat.result.recalculate'), icon: 'refresh-outline', onPress: () => router.back() },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('fidya.result.title') }} />
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
