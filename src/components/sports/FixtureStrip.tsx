import type { Match } from "@/lib/types/tournament";
import { KickoffTime } from "@/components/sports/KickoffTime";

/** Compact one-line fixture row, used for the next-3-days list. */
export function FixtureStrip({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return <p className="text-sm text-line/60">No fixtures in the next few days.</p>;
  }
  return (
    <ul className="divide-y divide-white/5 rounded-xl border border-white/10 bg-pitch-900">
      {matches.map((m) => (
        <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
          <span className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true">{m.home.flag}</span>
            <span className="font-medium">{m.home.code}</span>
            <span className="text-line/40">v</span>
            <span className="font-medium">{m.away.code}</span>
            <span aria-hidden="true">{m.away.flag}</span>
          </span>
          <span className="flex shrink-0 items-center gap-3 text-xs text-line/60">
            <span className="hidden sm:inline">{m.stage}</span>
            <KickoffTime kickoffUtc={m.kickoffUtc} withDay />
          </span>
        </li>
      ))}
    </ul>
  );
}
