import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { getAyah, getSurahMeta } from '@/core/quran';
import { useQuranStore, type Bookmark } from '@/store/quranStore';

const GOLD = '#C9971F';
const MUTED = '#8A8A85';

function BookmarkRow({ bookmark, onOpen }: { bookmark: Bookmark; onOpen: () => void }) {
  const { t } = useTranslation();
  const removeBookmark = useQuranStore((s) => s.removeBookmark);
  const meta = getSurahMeta(bookmark.surah);
  const ayah = getAyah(bookmark.surah, bookmark.ayah);

  return (
    <View className="flex-row items-center border-b border-neutral-100 py-3 dark:border-neutral-700">
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={t('quran.openBookmarkA11y', {
          name: meta.transliteration,
          key: `${bookmark.surah}:${bookmark.ayah}`,
        })}
        className="min-h-[44px] flex-1 justify-center pr-2 active:opacity-70"
      >
        <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
          {meta.transliteration} · {bookmark.surah}:{bookmark.ayah}
        </Text>
        <Text
          numberOfLines={1}
          className="mt-1 text-neutral-500 dark:text-neutral-300"
          style={{ fontSize: 18, textAlign: 'right', writingDirection: 'rtl' }}
        >
          {ayah.text}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => removeBookmark(bookmark.surah, bookmark.ayah)}
        accessibilityRole="button"
        accessibilityLabel={t('quran.removeBookmark', { key: `${bookmark.surah}:${bookmark.ayah}` })}
        className="min-h-[44px] min-w-[44px] items-center justify-center active:opacity-70"
      >
        <Ionicons name="trash-outline" size={20} color={MUTED} />
      </Pressable>
    </View>
  );
}

export function BookmarksScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bookmarks = useQuranStore((s) => s.bookmarks);

  return (
    <ScreenContainer>
      <View className="flex-row items-center border-b border-neutral-100 px-2 py-2 dark:border-neutral-700">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          className="min-h-[44px] min-w-[44px] items-center justify-center active:opacity-70"
        >
          <Ionicons name="arrow-back" size={22} color={MUTED} />
        </Pressable>
        <View className="flex-1 flex-row items-center">
          <Ionicons name="bookmark" size={18} color={GOLD} />
          <Text
            accessibilityRole="header"
            className="ml-2 text-base font-semibold text-neutral-900 dark:text-neutral-50"
          >
            {t('quran.bookmarks')}
          </Text>
        </View>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(b) => `${b.surah}:${b.ayah}`}
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, flexGrow: 1 }}
        renderItem={({ item }) => (
          <BookmarkRow
            bookmark={item}
            onOpen={() => router.push(`/quran/${item.surah}?ayah=${item.ayah}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState title={t('quran.noBookmarks')} subtitle={t('quran.noBookmarksHint')} />
        }
      />
    </ScreenContainer>
  );
}
