import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { EmptyState } from '@/components/EmptyState';
import { listSurahs, listSurahsByRevelation, matchesSurah, type SurahMeta } from '@/core/quran';
import { AttributionNotice } from './AttributionNotice';
import { ReadingShortcuts } from './ReadingShortcuts';

type SortMode = 'mushaf' | 'revelation';

function SortToggle({ mode, onChange }: { mode: SortMode; onChange: (m: SortMode) => void }) {
  const { t } = useTranslation();
  const options: SortMode[] = ['mushaf', 'revelation'];

  return (
    <View className="mb-4 flex-row rounded-lg bg-neutral-100 p-1 dark:bg-neutral-700">
      {options.map((option) => {
        const active = option === mode;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            className={`min-h-[44px] flex-1 items-center justify-center rounded-md ${
              active ? 'bg-neutral-0 dark:bg-neutral-900' : ''
            }`}
          >
            <Text
              className={`text-sm ${
                active
                  ? 'font-semibold text-neutral-900 dark:text-neutral-50'
                  : 'text-neutral-500 dark:text-neutral-300'
              }`}
            >
              {t(`quran.sort.${option}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SurahRow({ surah, onPress }: { surah: SurahMeta; onPress: () => void }) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('quran.surahA11y', {
        number: surah.number,
        name: surah.transliteration,
        n: surah.ayahCount,
      })}
      className="min-h-[44px] flex-row items-center border-b border-neutral-100 py-3 active:opacity-70 dark:border-neutral-700"
    >
      <View className="h-9 w-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700">
        <Text className="text-xs font-semibold text-neutral-700 dark:text-neutral-50">
          {surah.number}
        </Text>
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
          {surah.transliteration}
        </Text>
        <Text className="text-xs text-neutral-500 dark:text-neutral-300">
          {t(`quran.revelation.${surah.revelation}`)} · {t('quran.ayahCount', { n: surah.ayahCount })}
        </Text>
      </View>

      {/* Arabic name is decorative here — the row is already labelled for screen readers above. */}
      <Text
        className="ml-3 text-lg text-neutral-900 dark:text-neutral-50"
        style={{ writingDirection: 'rtl' }}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        {surah.name}
      </Text>
    </Pressable>
  );
}

export function SurahListScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [sort, setSort] = useState<SortMode>('mushaf');
  const [query, setQuery] = useState('');

  const surahs = useMemo(() => {
    const base = sort === 'mushaf' ? listSurahs() : listSurahsByRevelation();
    return base.filter((s) => matchesSurah(s, query));
  }, [sort, query]);

  return (
    <ScreenContainer>
      <FlatList
        data={surahs}
        keyExtractor={(s) => String(s.number)}
        contentContainerClassName="px-4 pb-6"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <ScreenHeader title={t('quran.title')} subtitle={t('quran.subtitle')} />
            {/* Above the fold and unconditional: this is the app's primary "source clearly
                indicated" surface. The footer copy sits 114 rows down and cannot be relied on. */}
            <AttributionNotice compact />
            <ReadingShortcuts />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('quran.searchPlaceholder')}
              accessibilityLabel={t('quran.searchPlaceholder')}
              className="mb-4 min-h-[44px] rounded-lg border border-neutral-100 bg-neutral-0 px-3 text-base text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
            />
            <SortToggle mode={sort} onChange={setSort} />
          </View>
        }
        renderItem={({ item }) => (
          <SurahRow surah={item} onPress={() => router.push(`/quran/${item.number}`)} />
        )}
        ListEmptyComponent={
          <EmptyState title={t('quran.noResults')} subtitle={t('quran.noResultsHint')} />
        }
      />
    </ScreenContainer>
  );
}
