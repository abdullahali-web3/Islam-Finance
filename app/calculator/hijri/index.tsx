import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { gregorianToHijri, hijriToGregorian, upcomingEvents, type CalDate } from '@/core/hijri';
import { formatHijri, formatGregorian, todayCalDate } from '@/features/hijri/hijriUi';
import { useSettingsStore } from '@/store/settingsStore';

type Dir = 'g2h' | 'h2g';

function NumberBox({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <View className="flex-1">
      <Text className="mb-1 text-xs text-neutral-500 dark:text-neutral-300">{label}</Text>
      <TextInput
        keyboardType="numeric"
        value={String(value)}
        onChangeText={(txt) => onChange(txt === '' ? 0 : Math.abs(Math.trunc(Number(txt) || 0)))}
        className="rounded-md border border-neutral-100 bg-neutral-0 px-3 py-2.5 text-base text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
      />
    </View>
  );
}

/** Hijri ↔ Gregorian converter + today's dual date + upcoming Islamic events. Computational tool. */
export default function HijriScreen() {
  const { t, i18n } = useTranslation();
  const hijriAdjust = useSettingsStore((s) => s.hijriAdjust);
  const setHijriAdjust = useSettingsStore((s) => s.setHijriAdjust);

  const today = todayCalDate();
  const todayHijri = gregorianToHijri(today, hijriAdjust);

  const [dir, setDir] = useState<Dir>('g2h');
  const [input, setInput] = useState<CalDate>(today);

  const switchDir = (next: Dir) => {
    setDir(next);
    setInput(next === 'g2h' ? today : gregorianToHijri(today, hijriAdjust));
  };
  const setField = (k: keyof CalDate, v: number) => setInput((p) => ({ ...p, [k]: v }));

  const output = dir === 'g2h' ? gregorianToHijri(input, hijriAdjust) : hijriToGregorian(input, hijriAdjust);
  const outputStr = dir === 'g2h' ? formatHijri(t, output) : formatGregorian(output, i18n.language);
  const events = upcomingEvents(today, 6, hijriAdjust);

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.hijri') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader title={t('home.card.hijri')} subtitle={t('hijri.subtitle')} />

        {/* Today */}
        <Card className="mb-4">
          <Text className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300">
            {t('hijri.today')}
          </Text>
          <Text className="mt-1 text-xl font-bold text-neutral-900 dark:text-neutral-50">
            {formatHijri(t, todayHijri)}
          </Text>
          <Text className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-300">
            {formatGregorian(today, i18n.language)}
          </Text>
        </Card>

        {/* Moon-sighting adjustment */}
        <View className="mb-4 flex-row items-center justify-between rounded-md bg-neutral-100 px-3 py-2 dark:bg-neutral-700">
          <Text className="text-xs text-neutral-700 dark:text-neutral-100">
            {t('hijri.adjust', { n: hijriAdjust > 0 ? `+${hijriAdjust}` : String(hijriAdjust) })}
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('hijri.adjustMinus')}
              onPress={() => setHijriAdjust(Math.max(-2, hijriAdjust - 1))}
              className="h-8 w-8 items-center justify-center rounded-md bg-neutral-0 dark:bg-neutral-900"
            >
              <Text className="text-lg text-neutral-900 dark:text-neutral-50">−</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('hijri.adjustPlus')}
              onPress={() => setHijriAdjust(Math.min(2, hijriAdjust + 1))}
              className="h-8 w-8 items-center justify-center rounded-md bg-neutral-0 dark:bg-neutral-900"
            >
              <Text className="text-lg text-neutral-900 dark:text-neutral-50">+</Text>
            </Pressable>
          </View>
        </View>

        {/* Converter */}
        <Text className="mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-300">
          {t('hijri.converter')}
        </Text>
        <View className="mb-3 flex-row gap-2">
          {(['g2h', 'h2g'] as Dir[]).map((d) => (
            <Pressable
              key={d}
              onPress={() => switchDir(d)}
              accessibilityRole="button"
              accessibilityState={{ selected: dir === d }}
              className={
                dir === d
                  ? 'flex-1 items-center rounded-md bg-green-500 px-3 py-2 dark:bg-green-600'
                  : 'flex-1 items-center rounded-md bg-neutral-100 px-3 py-2 dark:bg-neutral-700'
              }
            >
              <Text
                className={
                  dir === d
                    ? 'text-sm font-medium text-neutral-0'
                    : 'text-sm font-medium text-neutral-700 dark:text-neutral-100'
                }
              >
                {t(`hijri.dir.${d}`)}
              </Text>
            </Pressable>
          ))}
        </View>
        <View className="flex-row gap-2">
          <NumberBox label={t('hijri.year')} value={input.y} onChange={(v) => setField('y', v)} />
          <NumberBox label={t('hijri.month')} value={input.m} onChange={(v) => setField('m', v)} />
          <NumberBox label={t('hijri.day')} value={input.d} onChange={(v) => setField('d', v)} />
        </View>
        <Card className="mt-3">
          <Text className="text-xs text-neutral-500 dark:text-neutral-300">{t('hijri.result')}</Text>
          <Text className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-50">{outputStr}</Text>
        </Card>

        {/* Upcoming events */}
        <Text className="mb-2 mt-6 text-sm font-semibold text-neutral-500 dark:text-neutral-300">
          {t('hijri.events')}
        </Text>
        {events.map((e) => (
          <Card key={`${e.key}-${e.hijri.y}`} className="mb-2">
            <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              {t(`hijri.event.${e.key}`)}
            </Text>
            <Text className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-300">
              {formatHijri(t, e.hijri)} · {formatGregorian(e.gregorian, i18n.language)}
            </Text>
          </Card>
        ))}
        <Text className="mt-3 text-xs leading-5 text-neutral-500 dark:text-neutral-300">
          {t('hijri.note')}
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}
