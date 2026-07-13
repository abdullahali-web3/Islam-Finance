// Pure scheduling helpers for local notifications (ADR 0011 unit layer). No expo-notifications
// import lives here, so the trigger math is unit-testable in plain Jest. services/notifications.ts
// consumes these and maps them onto expo-notifications' trigger inputs.

/** A time of day for a repeating daily reminder. */
export type TimeOfDay = { hour: number; minute: number };

/** True when hour ∈ [0,23] and minute ∈ [0,59] and both are integers. */
export function isValidTimeOfDay({ hour, minute }: TimeOfDay): boolean {
  return (
    Number.isInteger(hour) &&
    Number.isInteger(minute) &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  );
}

/** Whole seconds from `from` until `target`, clamped to 0 (never schedules in the past). */
export function secondsUntil(target: Date, from: Date = new Date()): number {
  return Math.max(0, Math.round((target.getTime() - from.getTime()) / 1000));
}

/** True when `target` is strictly in the future relative to `from`. */
export function isFuture(target: Date, from: Date = new Date()): boolean {
  return target.getTime() > from.getTime();
}
