import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Pressable, Text, View, type ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ErrorState } from '@/components/ErrorState';
import { getSurah, isValidSurah, isValidVerse, type Ayah } from '@/core/quran';
import { useQuranStore } from '@/store/quranStore';
import { AttributionNotice } from './AttributionNotice';

/**
 * Arabic type sizing. The Uthmani script carries dense diacritics above and below the baseline, so it
 * needs far more line height than Latin text to stay legible — a normal ~1.4 ratio causes marks from
 * adjacent lines to collide. 2.0 is the floor that keeps them clear at this size.
 */
const ARABIC_FONT_SIZE = 26;
const ARABIC_LINE_HEIGHT = ARABIC_FONT_SIZE * 2;

const GOLD = '#C9971F';
const MUTED = '#8A8A85';

function AyahRow({ ayah }: { ayah: Ayah }) {
  const { t } = useTranslation();
  // Each row subscribes only to ITS OWN bookmark boolean. Zustand re-renders a row only when that
  // boolean flips, so toggling one ayah doesn't re-render the whole surah.
  const bookmarked = useQuranStore((s) =>
    s.bookmarks.some((b) => b.surah === ayah.surah && b.ayah === ayah.ayah),
  );
  const toggleBookmark = useQuranStore((s) => s.toggleBookmark);

  return (
    <View className="border-b border-neutral-100 py-5 dark:border-neutral-700">
      <Text
        className="text-neutral-900 dark:text-neutral-50"
        style={{
          fontSize: ARABIC_FONT_SIZE,
          lineHeight: ARABIC_LINE_HEIGHT,
          textAlign: 'right',
          writingDirection: 'rtl',
        }}
      >
        {ayah.text}
      </Text>
      <View className="mt-2 flex-row items-center justify-between">
        <Pressable
          onPress={() => toggleBookmark(ayah.surah, ayah.ayah)}
          accessibilityRole="button"
          accessibilityState={{ selected: bookmarked }}
          accessibilityLabel={t(bookmarked ? 'quran.removeBookmark' : 'quran.addBookmark', {
            key: ayah.key,
          })}
          className="-ml-2 min-h-[44px] min-w-[44px] items-center justify-center active:opacity-70"
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={bookmarked ? GOLD : MUTED}
          />
        </Pressable>
        <Text className="text-xs text-neutral-500 dark:text-neutral-300" style={{ textAlign: 'right' }}>
          {ayah.key}
        </Text>
      </View>
    </View>
  );
}

export function SurahReaderScreen({ surah, initialAyah }: { surah: number; initialAyah?: number }) {
  const { t } = useTranslation();
  const router = useRouter();
  // This route lives outside (tabs), so there is no tab bar to own the bottom inset — without this
  // the last ayah sits under the gesture bar. ScreenContainer only applies the top inset by design.
  const insets = useSafeAreaInsets();
  const setLastRead = useQuranStore((s) => s.setLastRead);

  const valid = isValidSurah(surah);
  const data = useMemo(() => (valid ? getSurah(surah) : null), [surah, valid]);

  // The resume ayah must be validated against THIS surah before it drives scroll math. A deep link
  // like islamfinance://quran/1?ayah=999 (Al-Fatiha has 7) would otherwise reach
  // FlatList.scrollToIndex with an out-of-range index, which throws a synchronous Invariant Violation
  // that no error boundary catches (it's in a timer, not render) — i.e. an open-on-link crash.
  // In-app producers (ReadingShortcuts, BookmarksScreen) only ever emit in-range verses.
  const resumeAyah = initialAyah && isValidVerse(surah, initialAyah) ? initialAyah : undefined;

  const listRef = useRef<FlatList<Ayah>>(null);
  const scrollFailRef = useRef(0);
  // The top-most visible ayah, tracked cheaply in a ref during scroll (no re-render) and persisted as
  // the last-read position only when scrolling settles and when leaving — not on every frame.
  const topAyahRef = useRef(resumeAyah ?? 1);

  // Stable across renders (FlatList requires onViewableItemsChanged not to change), and it only
  // writes the ref — never reads it during render.
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems.find((v) => v.isViewable)?.item as Ayah | undefined;
    if (first) topAyahRef.current = first.ayah;
  }, []);

  const commitLastRead = useCallback(() => {
    setLastRead(surah, topAyahRef.current);
  }, [setLastRead, surah]);

  // Persist the resume point when the reader is left (or the surah changes).
  useEffect(() => commitLastRead, [commitLastRead]);

  // Resume: if opened at a validated ayah, scroll to it after first layout. Variable row heights mean
  // scrollToIndex can miss for far ayat, so onScrollToIndexFailed estimates an offset and retries.
  // targetIndex is guaranteed in-range because resumeAyah passed isValidVerse (ayat.length ===
  // ayahCount), so scrollToIndex never throws the out-of-range invariant.
  const targetIndex = resumeAyah && resumeAyah > 1 ? resumeAyah - 1 : null;
  useEffect(() => {
    if (targetIndex == null) return;
    const id = setTimeout(() => {
      listRef.current?.scrollToIndex({ index: targetIndex, animated: false, viewPosition: 0 });
    }, 0);
    return () => clearTimeout(id);
  }, [targetIndex]);

  if (!data) {
    return (
      <ScreenContainer>
        <ErrorState
          title={t('quran.notFoundTitle')}
          message={t('quran.notFoundMessage')}
          retryLabel={t('common.back')}
          onRetry={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  const { meta, bismillah, ayat } = data;

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
        <View className="flex-1">
          <Text
            accessibilityRole="header"
            className="text-base font-semibold text-neutral-900 dark:text-neutral-50"
          >
            {meta.transliteration}
          </Text>
          <Text className="text-xs text-neutral-500 dark:text-neutral-300">
            {meta.englishName} · {t('quran.ayahCount', { n: meta.ayahCount })}
          </Text>
        </View>
        <Text
          className="px-2 text-lg text-neutral-900 dark:text-neutral-50"
          style={{ writingDirection: 'rtl' }}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {meta.name}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={ayat}
        keyExtractor={(a) => a.key}
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        // Al-Baqara is 286 ayat of dense RTL text; keep the offscreen window tight.
        initialNumToRender={10}
        windowSize={7}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 30 }}
        onMomentumScrollEnd={commitLastRead}
        // A drag that ends without a fling emits no onMomentumScrollEnd, so also commit on drag-end;
        // setLastRead dedupes, so this adds no redundant writes.
        onScrollEndDrag={commitLastRead}
        onScrollToIndexFailed={(info: { index: number; averageItemLength: number }) => {
          // Only fires for in-range-but-not-yet-realised rows (targetIndex is always in range). Cap
          // retries so a stubborn layout can't spin the estimate→retry loop forever.
          if (scrollFailRef.current >= 3) return;
          scrollFailRef.current += 1;
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: false,
          });
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index: info.index, animated: false, viewPosition: 0 });
          }, 60);
        }}
        ListHeaderComponent={
          <View>
            {/* Above the fold, not in the footer: as a ListFooterComponent this sat 286 ayat down
                in Al-Baqara, so a user could read the whole surah without ever seeing the source.
                ADR 0016 treats a visible attribution surface as a licence condition. */}
            <AttributionNotice compact />
            {bismillah ? (
              <View className="items-center border-b border-neutral-100 py-6 dark:border-neutral-700">
                <Text
                  className="text-neutral-900 dark:text-neutral-50"
                  style={{
                    fontSize: ARABIC_FONT_SIZE,
                    lineHeight: ARABIC_LINE_HEIGHT,
                    textAlign: 'center',
                    writingDirection: 'rtl',
                  }}
                >
                  {bismillah}
                </Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <AyahRow ayah={item} />}
      />
    </ScreenContainer>
  );
}
