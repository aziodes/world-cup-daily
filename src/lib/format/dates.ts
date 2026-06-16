import { FALLBACK_TIME_ZONE } from "@/lib/utils/timezone";

/** "19:00" or "7:00 PM" depending on locale, in the given timezone. */
export function formatKickoffTime(
  kickoffUtc: string,
  timeZone: string = FALLBACK_TIME_ZONE,
  locale?: string
): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date(kickoffUtc));
}

/** "Thu 11 Jun" style short date in the given timezone. */
export function formatMatchDay(
  kickoffUtc: string,
  timeZone: string = FALLBACK_TIME_ZONE,
  locale?: string
): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone,
  }).format(new Date(kickoffUtc));
}

/** Local calendar date key "YYYY-MM-DD" for grouping fixtures by day. */
export function localDateKey(utcIso: string, timeZone: string = FALLBACK_TIME_ZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).format(new Date(utcIso));
}

export function isSameLocalDay(aUtc: string, bUtc: string, timeZone?: string): boolean {
  return localDateKey(aUtc, timeZone) === localDateKey(bUtc, timeZone);
}

/** True if the kickoff falls within the next `days` local days (excluding today). */
export function isWithinNextDays(
  kickoffUtc: string,
  days: number,
  now: Date = new Date(),
  timeZone?: string
): boolean {
  const todayKey = localDateKey(now.toISOString(), timeZone);
  const kickoffKey = localDateKey(kickoffUtc, timeZone);
  if (kickoffKey <= todayKey) return false;
  const horizon = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return kickoffKey <= localDateKey(horizon.toISOString(), timeZone);
}
