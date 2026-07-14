import { ScrollView, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ResultView, type ResultAction } from '@/components/ResultView';
import { buildInheritanceResultView } from '@/features/inheritance/toResultView';
import { useHistoryAction } from '@/features/history/useHistoryAction';
import { useInheritanceStore } from '@/store/inheritanceStore';

/** Inheritance result screen (ADR 0006 route: /calculator/inheritance/result). */
export default function InheritanceResultScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const last = useInheritanceStore((s) => s.last);

  const view = last
    ? buildInheritanceResultView(last.result, { t, locale: i18n.language, madhab: last.madhab })
    : null;

  const saveAction = useHistoryAction({
    domain: 'inheritance',
    titleKey: 'home.card.inheritance',
    headline: view?.headline ?? '',
    subtitle: view?.headlineLabel,
  });

  if (!last || !view) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ headerShown: true, title: t('home.card.inheritance') }} />
        <EmptyState
          title={t('inheritance.result.emptyTitle')}
          subtitle={t('inheritance.result.emptySubtitle')}
        />
      </ScreenContainer>
    );
  }

  const actions: ResultAction[] = [
    saveAction,
    {
      label: t('common.share'),
      icon: 'share-outline',
      onPress: () => {
        const lines = view.rows.map((r) => `${r.label}: ${r.value}`).join('\n');
        Share.share({
          message: t('inheritance.result.shareMessage', {
            estate: view.headline,
            lines,
            disclaimer: view.disclaimer,
          }),
        });
      },
    },
    { label: t('zakat.result.recalculate'), icon: 'refresh-outline', onPress: () => router.back() },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('inheritance.result.title') }} />
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
