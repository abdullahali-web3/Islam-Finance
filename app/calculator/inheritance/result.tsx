import { ScrollView, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ResultView, type ResultAction } from '@/components/ResultView';
import { buildInheritanceResultView } from '@/features/inheritance/toResultView';
import { useInheritanceStore } from '@/store/inheritanceStore';

/**
 * Inheritance result screen (ADR 0006 route: /calculator/inheritance/result). Reads the last
 * computation and renders it through the shared ResultView (per-heir breakdown + cited source +
 * ʿAwl/Radd + blocked-heir note + provisional disclaimer + Share). No ad on this screen (CLAUDE.md).
 */
export default function InheritanceResultScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const last = useInheritanceStore((s) => s.last);

  if (!last) {
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

  const view = buildInheritanceResultView(last.result, {
    t,
    locale: i18n.language,
    madhab: last.madhab,
  });

  const actions: ResultAction[] = [
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
    {
      label: t('zakat.result.recalculate'),
      icon: 'refresh-outline',
      onPress: () => router.back(),
    },
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
