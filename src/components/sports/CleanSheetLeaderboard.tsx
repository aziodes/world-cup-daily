import type { CleanSheetEntry } from "@/lib/types/tournament";

export function CleanSheetLeaderboard({ entries }: { entries: CleanSheetEntry[] }) {
  return (
    <ol className="divide-y divide-white/5 rounded-xl border border-white/10 bg-pitch-900">
      {entries.map((e, i) => (
        <li key={e.player} className="flex items-center gap-3 px-4 py-2.5 text-sm">
          <span className="w-5 shrink-0 text-right tabular-nums text-line/50">{i + 1}</span>
          <span aria-hidden="true">{e.team.flag}</span>
          <span className="min-w-0 flex-1 truncate font-medium">{e.player}</span>
          <span className="shrink-0 text-xs tabular-nums text-line/50">
            {e.matchesPlayed} played
          </span>
          <span className="w-8 shrink-0 text-right text-base font-bold tabular-nums text-emerald-400">
            {e.cleanSheets}
          </span>
        </li>
      ))}
    </ol>
  );
}
