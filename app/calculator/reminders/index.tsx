import { useState } from 'react';
import { ScrollView, View, Text, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { computePrayerTimes, type PrayerName } from '@/core/prayer';
import { upcomingEvents } from '@/core/hijri';
import { asrMadhabForMadhab } from '@/features/prayer/prayerUi';
import { todayCalDate } from '@/features/hijri/hijriUi';
import { syncReminders } from '@/services/reminders';
import { useSettingsStore } from '@/store/settingsStore';

/** Reminders screen (ADR 0006 route: /calculator/reminders). Local scheduled notifications. */
export default function RemindersScreen() {
  const { t } = useTranslation();
  const madhab = useSettingsStore((s) => s.madhab);
  const method = useSettingsStore((s) => s.prayerMethod);
  const location = useSettingsStore((s) => s.location);
  const hijriAdjust = useSettingsStore((s) => s.hijriAdjust);
  const remindersPrayer = useSettingsStore((s) => s.remindersPrayer);
  const remindersEvents = useSettingsStore((s) => s.remindersEvents);
  const setRemindersPrayer = useSettingsStore((s) => s.setRemindersPrayer);
  const setRemindersEvents = useSettingsStore((s) => s.setRemindersEvents);
  const [denied, setDenied] = useState(false);

  const times = location
    ? computePrayerTimes(location.lat, location.lng, new Date(), method, asrMadhabForMadhab(madhab))
    : null;
  const events = upcomingEvents(todayCalDate(), 6, hijriAdjust);

  const sync = async (prayerOn: boolean, eventsOn: boolean) => {
    const ok = await syncReminders({
      prayerOn,
      eventsOn,
      prayerTimes: times,
      prayerLabel: (n: PrayerName) => t(`prayer.name.${n}`),
      prayerBody: (n: PrayerName) => t('reminders.prayerBody', { name: t(`prayer.name.${n}`) }),
      events,
      eventTitle: (k: string) => t(`hijri.event.${k}`),
      eventBody: (k: string) => t('reminders.eventBody', { name: t(`hijri.event.${k}`) }),
    });
    setDenied(!ok);
    return ok;
  };

  const togglePrayer = async (on: boolean) => {
    setRemindersPrayer(on);
    const ok = await sync(on, remindersEvents);
    if (!ok) setRemindersPrayer(false);
  };
  const toggleEvents = async (on: boolean) => {
    setRemindersEvents(on);
    const ok = await sync(remindersPrayer, on);
    if (!ok) setRemindersEvents(false);
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.reminders') }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-10">
        <ScreenHeader title={t('home.card.reminders')} subtitle={t('reminders.subtitle')} />

        {denied ? (
          <View
            accessibilityRole="alert"
            className="mb-4 rounded-md border border-gold-500 bg-gold-100 px-3 py-2.5"
          >
            <Text className="text-xs leading-5 text-gold-600">{t('reminders.denied')}</Text>
          </View>
        ) : null}

        <Card className="mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                {t('reminders.prayer')}
              </Text>
              <Text className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-300">
                {location ? t('reminders.prayerDesc') : t('reminders.needLocation')}
              </Text>
            </View>
            <Switch value={remindersPrayer} onValueChange={togglePrayer} disabled={!location} />
          </View>
        </Card>

        <Card className="mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                {t('reminders.events')}
              </Text>
              <Text className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-300">
                {t('reminders.eventsDesc')}
              </Text>
            </View>
            <Switch value={remindersEvents} onValueChange={toggleEvents} />
          </View>
        </Card>

        <Text className="mt-3 text-xs leading-5 text-neutral-500 dark:text-neutral-300">
          {t('reminders.note')}
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}
