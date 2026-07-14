import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { gregorianToHijri } from '@/core/hijri';
import { computePrayerTimes, nextPrayer } from '@/core/prayer';
import { formatHijri, todayCalDate } from '@/features/hijri/hijriUi';
import { asrMadhabForMadhab, formatTime } from '@/features/prayer/prayerUi';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * Live home header: greeting + today's Hijri date + the next prayer (when a location is set). Reads
 * settings (madhab, hijriAdjust, prayer method, cached location) and computes locally/offline.
 */
export function HomeHeader() {
  const { t } = useTranslation();
  const madhab = useSettingsStore((s) => s.madhab);
  const hijriAdjust = useSettingsStore((s) => s.hijriAdjust);
  const method = useSettingsStore((s) => s.prayerMethod);
  const location = useSettingsStore((s) => s.location);

  const today = todayCalDate();
  const hijri = gregorianToHijri(today, hijriAdjust);

  const now = new Date();
  const times = location
    ? computePrayerTimes(location.lat, location.lng, now, method, asrMadhabForMadhab(madhab))
    : null;
  const next = times ? nextPrayer(times, now) : null;

  return (
    <View className="rounded-lg bg-green-500 px-5 py-6 dark:bg-green-700">
      <Text className="text-sm font-medium text-green-100">{t('home.headerGreeting')}</Text>
      <Text className="mt-1 text-2xl font-bold text-neutral-0">{formatHijri(t, hijri)}</Text>
      {next ? (
        <Text className="mt-2 text-sm text-green-100">
          {t('home.nextPrayer', { name: t(`prayer.name.${next.name}`), time: formatTime(next.time) })}
        </Text>
      ) : (
        <Text className="mt-2 text-xs text-green-100">
          {location ? t('home.prayerTomorrow') : t('home.prayerPrompt')}
        </Text>
      )}
    </View>
  );
}
