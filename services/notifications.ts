import * as Notifications from 'expo-notifications';
import { isValidTimeOfDay, isFuture, type TimeOfDay } from './notificationSchedule';

/**
 * Local notification plumbing (roadmap §6, ADR 0007 = local-only, no remote push). Everything that
 * schedules or cancels a reminder goes through this module — screens/stores never call
 * expo-notifications directly — so a future remote-push adapter (if an ADR 0007 trigger ever fires)
 * is a single-file change. No content lives here; the notifications-builder agent adds the reminder
 * catalog (prayer / Hijri / Ramadan / haul) on top of this.
 */

export type ReminderId = string;

export type ReminderContent = {
  /** Already-translated title (i18n key resolved by the caller). */
  title: string;
  body: string;
  /** Optional payload for deep-linking on tap, e.g. { route: '/calculator/zakat' }. */
  data?: Record<string, unknown>;
};

/** Foreground presentation config. Call once from the root layout before scheduling. */
export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Request notification permission at the point the user first opts into a reminder — never at
 * startup (agent rule). Returns whether permission is granted; the app stays fully usable if not.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/** Schedule a reminder that repeats every day at the given local time. */
export async function scheduleDailyReminder(
  content: ReminderContent,
  time: TimeOfDay
): Promise<ReminderId> {
  if (!isValidTimeOfDay(time)) {
    throw new Error(`Invalid time of day: ${time.hour}:${time.minute}`);
  }
  return Notifications.scheduleNotificationAsync({
    content: { title: content.title, body: content.body, data: content.data },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: time.hour,
      minute: time.minute,
    },
  });
}

/** Schedule a one-off reminder at a specific future date (e.g. a Zakat haul anniversary). */
export async function scheduleDateReminder(
  content: ReminderContent,
  date: Date
): Promise<ReminderId> {
  if (!isFuture(date)) {
    throw new Error('Cannot schedule a reminder in the past.');
  }
  return Notifications.scheduleNotificationAsync({
    content: { title: content.title, body: content.body, data: content.data },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
  });
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
