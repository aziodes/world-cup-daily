export const FALLBACK_TIME_ZONE = "UTC";

/**
 * Detect the viewer's IANA timezone in the browser.
 * Safe to call anywhere: returns the UTC fallback on the server
 * or when the Intl API is unavailable.
 *
 * Later: persist the result in a cookie (e.g. `tz=America/New_York`)
 * from a client component, read it in server components via
 * `cookies().get("tz")`, and pass it down so the first server render
 * already matches the viewer's timezone (no client-side flash).
 */
export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || FALLBACK_TIME_ZONE;
  } catch {
    return FALLBACK_TIME_ZONE;
  }
}
