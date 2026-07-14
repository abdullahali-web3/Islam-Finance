import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Magnetometer } from 'expo-sensors';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { LoadingState } from '@/components/LoadingState';
import { computePrayerTimes, nextPrayer, qiblaBearing, PRAYER_ORDER } from '@/core/prayer';
import {
  PRAYER_METHOD_KEYS,
  asrMadhabForMadhab,
  formatTime,
  headingFromMagnetometer,
} from '@/features/prayer/prayerUi';
import { getCurrentCoords } from '@/services/location';
import { useSettingsStore } from '@/store/settingsStore';

/** Prayer Times + Qibla screen (ADR 0006 route: /calculator/prayer-times). Native location + compass. */
export default function PrayerTimesScreen() {
  const { t } = useTranslation();
  const madhab = useSettingsStore((s) => s.madhab);
  const method = useSettingsStore((s) => s.prayerMethod);
  const setPrayerMethod = useSettingsStore((s) => s.setPrayerMethod);
  const location = useSettingsStore((s) => s.location);
  const setLocation = useSettingsStore((s) => s.setLocation);

  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    Magnetometer.setUpdateInterval(200);
    const sub = Magnetometer.addListener(({ x, y }) => setHeading(headingFromMagnetometer(x, y)));
    return () => sub.remove();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    setDenied(false);
    const coords = await getCurrentCoords();
    if (coords) setLocation(coords);
    else setDenied(true);
    setLoading(false);
  };

  const asr = asrMadhabForMadhab(madhab);
  const times = useMemo(
    () => (location ? computePrayerTimes(location.lat, location.lng, new Date(), method, asr) : null),
    [location, method, asr]
  );
  const next = times ? nextPrayer(times, new Date()) : null;
  const bearing = location ? qiblaBearing(location.lat, location.lng) : 0;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.prayerTimes') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader title={t('home.card.prayerTimes')} subtitle={t('prayer.subtitle')} />

        {!location ? (
          <Card>
            <Text className="text-sm text-neutral-700 dark:text-neutral-100">
              {denied ? t('prayer.denied') : t('prayer.needLocation')}
            </Text>
            {loading ? (
              <LoadingState label={t('prayer.locating')} />
            ) : (
              <Pressable
                onPress={fetchLocation}
                accessibilityRole="button"
                className="mt-3 min-h-[44px] items-center justify-center rounded-md bg-green-500 px-4 py-3 active:opacity-80 dark:bg-green-600"
              >
                <Text className="text-base font-semibold text-neutral-0">{t('prayer.getLocation')}</Text>
              </Pressable>
            )}
          </Card>
        ) : (
          <>
            {/* Prayer times */}
            <Card className="mb-4">
              {PRAYER_ORDER.map((name) => {
                const isNext = next?.name === name;
                return (
                  <View
                    key={name}
                    className={
                      isNext
                        ? 'flex-row items-center justify-between rounded-md bg-green-50 px-3 py-3 dark:bg-green-700'
                        : 'flex-row items-center justify-between px-3 py-3'
                    }
                  >
                    <Text
                      className={
                        isNext
                          ? 'text-base font-bold text-green-600 dark:text-neutral-0'
                          : 'text-base text-neutral-900 dark:text-neutral-50'
                      }
                    >
                      {t(`prayer.name.${name}`)}
                      {isNext ? ` · ${t('prayer.next')}` : ''}
                    </Text>
                    <Text
                      className={
                        isNext
                          ? 'text-base font-bold text-green-600 dark:text-neutral-0'
                          : 'text-base font-medium text-neutral-900 dark:text-neutral-50'
                      }
                    >
                      {times ? formatTime(times[name]) : ''}
                    </Text>
                  </View>
                );
              })}
            </Card>

            {/* Qibla */}
            <Card className="mb-4 items-center">
              <Text className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300">
                {t('prayer.qibla')}
              </Text>
              <View
                accessibilityLabel={t('prayer.qiblaBearing', { deg: Math.round(bearing) })}
                className="my-3 h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-100 dark:border-neutral-700"
                style={{ transform: [{ rotate: `${bearing - heading}deg` }] }}
              >
                <Ionicons name="navigate" size={48} color="#1B5E20" />
              </View>
              <Text className="text-sm text-neutral-500 dark:text-neutral-300">
                {t('prayer.qiblaBearing', { deg: Math.round(bearing) })}
              </Text>
              <Text className="mt-1 text-xs text-neutral-500 dark:text-neutral-300">
                {t('prayer.compassNote')}
              </Text>
            </Card>

            {/* Method selector */}
            <Text className="mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-300">
              {t('prayer.method')}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {PRAYER_METHOD_KEYS.map((m) => {
                const active = m === method;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setPrayerMethod(m)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    className={
                      active
                        ? 'rounded-md bg-green-500 px-3 py-2 dark:bg-green-600'
                        : 'rounded-md bg-neutral-100 px-3 py-2 dark:bg-neutral-700'
                    }
                  >
                    <Text
                      className={
                        active
                          ? 'text-xs font-medium text-neutral-0'
                          : 'text-xs font-medium text-neutral-700 dark:text-neutral-100'
                      }
                    >
                      {t(`prayer.methodName.${m}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={fetchLocation} className="mt-4" accessibilityRole="button">
              <Text className="text-sm font-medium text-green-500 dark:text-green-100">
                {t('prayer.updateLocation')}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
