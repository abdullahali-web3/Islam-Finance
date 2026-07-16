import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getSurahMeta } from '@/core/quran';
import { useQuranStore } from '@/store/quranStore';

/**
 * The two entry points that make the reader feel continuous: resume where you left off, and jump to
 * saved ayat. Rendered in the surah-list header; each half hides itself when it has nothing to show,
 * so a first-run user sees neither.
 */
export function ReadingShortcuts() {
  const { t } = useTranslation();
  const router = useRouter();
  const lastRead = useQuranStore((s) => s.lastRead);
  const bookmarkCount = useQuranStore((s) => s.bookmarks.length);

  if (!lastRead && bookmarkCount === 0) return null;

  return (
    <View className="mb-4 gap-2">
      {lastRead ? (
        <Pressable
          onPress={() => router.push(`/quran/${lastRead.surah}?ayah=${lastRead.ayah}`)}
          accessibilityRole="button"
          accessibilityLabel={t('quran.continueReadingA11y', {
            name: getSurahMeta(lastRead.surah).transliteration,
            key: `${lastRead.surah}:${lastRead.ayah}`,
          })}
          className="min-h-[44px] flex-row items-center rounded-lg border border-neutral-100 bg-neutral-0 p-3 active:opacity-80 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <Ionicons name="book-outline" size={20} color="#1B5E20" />
          <View className="ml-3 flex-1">
            <Text className="text-xs text-neutral-500 dark:text-neutral-300">
              {t('quran.continueReading')}
            </Text>
            <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              {getSurahMeta(lastRead.surah).transliteration} · {lastRead.surah}:{lastRead.ayah}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#8A8A85" />
        </Pressable>
      ) : null}

      {bookmarkCount > 0 ? (
        <Pressable
          onPress={() => router.push('/quran/bookmarks')}
          accessibilityRole="button"
          accessibilityLabel={t('quran.bookmarksA11y', { count: bookmarkCount })}
          className="min-h-[44px] flex-row items-center rounded-lg border border-neutral-100 bg-neutral-0 p-3 active:opacity-80 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <Ionicons name="bookmark" size={20} color="#C9971F" />
          <Text className="ml-3 flex-1 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            {t('quran.bookmarks')}
          </Text>
          <Text className="mr-2 text-sm text-neutral-500 dark:text-neutral-300">{bookmarkCount}</Text>
          <Ionicons name="chevron-forward" size={18} color="#8A8A85" />
        </Pressable>
      ) : null}
    </View>
  );
}
