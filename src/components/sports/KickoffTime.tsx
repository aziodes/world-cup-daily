"use client";

import { useEffect, useState } from "react";
import { formatKickoffTime, formatMatchDay } from "@/lib/format/dates";
import { detectTimeZone, FALLBACK_TIME_ZONE } from "@/lib/utils/timezone";

/**
 * Renders a kickoff time in the viewer's local timezone.
 * Server-renders in UTC, then re-renders locally after hydration —
 * `suppressHydrationWarning` covers the expected mismatch.
 */
export function KickoffTime({
  kickoffUtc,
  withDay = false,
}: {
  kickoffUtc: string;
  withDay?: boolean;
}) {
  const [timeZone, setTimeZone] = useState<string>(FALLBACK_TIME_ZONE);

  useEffect(() => {
    setTimeZone(detectTimeZone());
  }, []);

  const time = formatKickoffTime(kickoffUtc, timeZone);
  const day = withDay ? `${formatMatchDay(kickoffUtc, timeZone)} · ` : "";

  return (
    <time dateTime={kickoffUtc} suppressHydrationWarning className="tabular-nums">
      {day}
      {time}
      {timeZone === FALLBACK_TIME_ZONE && <span className="text-line/50"> UTC</span>}
    </time>
  );
}
