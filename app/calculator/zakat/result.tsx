import { ScrollView, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { ResultView, type ResultAction } from '@/components/ResultView';
import { buildZakatResultView } from '@/features/zakat/toResultView';
import { useZakatStore } from '@/store/zakatStore';

/**
 * Zakat result screen (ADR 0006 route: /calculator/zakat/result). Reads the last computation from the
 * transient store and renders it through the shared ResultView (breakdown + cited source + provisional
 * disclaimer + actions). No ad on this screen (CLAUDE.md). If reached without a computation (e.g. deep
 * link), it shows an empty state prompting the user to run the calculator.
 */
export default function ZakatResultScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const last = useZakatStore((s) => s.last);

  if (!last) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ headerShown: true, title: t('home.card.zakat') }} />
        <EmptyState title={t('zakat.result.emptyTitle')} subtitle={t('zakat.result.emptySubtitle')} />
      </ScreenContainer>
    );
  }

  const view = buildZakatResultView(last.result, {
    t,
    locale: i18n.language,
    madhab: last.madhab,
    nisabBasis: last.input.nisabBasis,
    input: last.input,
  });

  const actions: ResultAction[] = [
    {
      label: t('common.share'),
      icon: 'share-outline',
      onPress: () => {
        // i18n template (no in-code concatenation) so word order/structure is translatable (ADR 0009).
        Share.share({
          message: t('zakat.result.shareMessage', {
            label: view.headlineLabel,
            amount: view.headline,
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
      <Stack.Screen options={{ headerShown: true, title: t('zakat.result.title') }} />
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
