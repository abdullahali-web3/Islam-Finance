import { PRAYER_ORDER, type PrayerName, type PrayerTimesResult } from '@/core/prayer';
import type { UpcomingEvent } from '@/core/hijri';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
  scheduleDateReminder,
  cancelAllReminders,
} from './notifications';

/**
 * Reminder orchestration (roadmap §6) on top of the local-notification plumbing. Cancels everything
 * and re-schedules from the current toggle state — so there are no orphaned notifications. Prayer
 * reminders are daily at today's computed times (approximate across the year; recomputed each time
 * the user opens/toggles). Event reminders are one-off on the morning of each upcoming Islamic date.
 */
export type ReminderSyncOptions = {
  prayerOn: boolean;
  eventsOn: boolean;
  prayerTimes: PrayerTimesResult | null;
  prayerLabel: (name: PrayerName) => string;
  prayerBody: (name: PrayerName) => string;
  events: UpcomingEvent[];
  eventTitle: (key: string) => string;
  eventBody: (key: string) => string;
};

/** Returns false if notification permission was denied (caller reverts the toggle). */
export async function syncReminders(opts: ReminderSyncOptions): Promise<boolean> {
  await cancelAllReminders();
  if (!opts.prayerOn && !opts.eventsOn) return true;

  const granted = await requestNotificationPermission();
  if (!granted) return false;

  if (opts.prayerOn && opts.prayerTimes) {
    for (const name of PRAYER_ORDER) {
      if (name === 'sunrise') continue; // sunrise isn't a prayer
      const d = opts.prayerTimes[name];
      await scheduleDailyReminder(
        { title: opts.prayerLabel(name), body: opts.prayerBody(name) },
        { hour: d.getHours(), minute: d.getMinutes() }
      );
    }
  }

  if (opts.eventsOn) {
    for (const ev of opts.events) {
      const date = new Date(ev.gregorian.y, ev.gregorian.m - 1, ev.gregorian.d, 9, 0, 0);
      if (date.getTime() > Date.now()) {
        await scheduleDateReminder(
          { title: opts.eventTitle(ev.key), body: opts.eventBody(ev.key) },
          date
        );
      }
    }
  }
  return true;
}
