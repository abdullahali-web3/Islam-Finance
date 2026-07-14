import { ScrollView, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { EmptyState } from '@/components/EmptyState';
import { Card } from '@/components/Card';
import { formatGregorian } from '@/features/hijri/hijriUi';
import { formatTime } from '@/features/prayer/prayerUi';
import { useHistoryStore } from '@/store/historyStore';

function formatWhen(ms: number, locale: string): string {
  const d = new Date(ms);
  const date = formatGregorian({ y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() }, locale);
  return `${date} · ${formatTime(d)}`;
}

export default function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const entries = useHistoryStore((s) => s.entries);
  const remove = useHistoryStore((s) => s.remove);
  const clear = useHistoryStore((s) => s.clear);

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-8">
        <ScreenHeader
          title={t('tabs.history')}
          right={
            entries.length > 0 ? (
              <Pressable onPress={clear} accessibilityRole="button" accessibilityLabel={t('history.clear')}>
                <Text className="text-sm font-medium text-gold-600">{t('history.clear')}</Text>
              </Pressable>
            ) : null
          }
        />

        {entries.length === 0 ? (
          <View className="mt-16">
            <EmptyState title={t('history.emptyTitle')} subtitle={t('history.emptySubtitle')} />
          </View>
        ) : (
          entries.map((e) => (
            <Card key={e.id} className="mb-2">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300">
                    {t(e.titleKey)}
                  </Text>
                  {e.subtitle ? (
                    <Text className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-300">
                      {e.subtitle}
                    </Text>
                  ) : null}
                  <Text className="mt-1 text-xl font-bold text-neutral-900 dark:text-neutral-50">
                    {e.headline}
                  </Text>
                  <Text className="mt-1 text-xs text-neutral-500 dark:text-neutral-300">
                    {formatWhen(e.createdAt, i18n.language)}
                  </Text>
                </View>
                <Pressable
                  onPress={() => remove(e.id)}
                  accessibilityRole="button"
                  accessibilityLabel={t('history.delete')}
                  hitSlop={10}
                  className="min-h-[44px] min-w-[44px] items-end"
                >
                  <Ionicons name="trash-outline" size={18} color="#8A8A85" />
                </Pressable>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
