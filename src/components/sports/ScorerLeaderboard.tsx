import type { ScorerEntry } from "@/lib/types/tournament";

export function ScorerLeaderboard({ scorers }: { scorers: ScorerEntry[] }) {
  return (
    <ol className="divide-y divide-white/5 rounded-xl border border-white/10 bg-pitch-900">
      {scorers.map((s, i) => (
        <li key={s.player} className="flex items-center gap-3 px-4 py-2.5 text-sm">
          <span className="w-5 shrink-0 text-right tabular-nums text-line/50">{i + 1}</span>
          <span aria-hidden="true">{s.team.flag}</span>
          <span className="min-w-0 flex-1 truncate font-medium">{s.player}</span>
          <span className="shrink-0 tabular-nums text-line/60" title={`${s.assists} assists`}>
            {s.assists}<span className="text-line/40"> A</span>
          </span>
          <span className="w-8 shrink-0 text-right text-base font-bold tabular-nums text-gold">
            {s.goals}
          </span>
        </li>
      ))}
    </ol>
  );
}
