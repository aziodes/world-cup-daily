import type { Group, Qualification } from "@/lib/types/tournament";
import { formatGoalDifference, sortStandings } from "@/lib/format/standings";
import { cn } from "@/lib/utils/cn";

const QUALIFICATION_BORDER: Record<Qualification, string> = {
  qualified: "border-l-emerald-400",
  "in-contention": "border-l-gold",
  eliminated: "border-l-white/15",
};

export function StandingsTable({ group, compact = false }: { group: Group; compact?: boolean }) {
  const rows = sortStandings(group.rows);
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-pitch-900">
      <table className="w-full text-sm">
        <caption className="px-4 pt-3 text-left font-display text-base font-bold">
          {group.name}
        </caption>
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-line/50">
            <th scope="col" className="px-4 py-2">Team</th>
            <th scope="col" className="px-2 py-2 text-center">P</th>
            {!compact && (
              <>
                <th scope="col" className="px-2 py-2 text-center">W</th>
                <th scope="col" className="px-2 py-2 text-center">D</th>
                <th scope="col" className="px-2 py-2 text-center">L</th>
              </>
            )}
            <th scope="col" className="px-2 py-2 text-center">GD</th>
            <th scope="col" className="px-4 py-2 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.team.id}
              className={cn(
                "border-l-2 border-t border-t-white/5",
                QUALIFICATION_BORDER[row.qualification]
              )}
            >
              <th scope="row" className="px-4 py-2 text-left font-medium">
                <span aria-hidden="true" className="mr-2">{row.team.flag}</span>
                <span className="sm:hidden">{row.team.code}</span>
                <span className="hidden sm:inline">{row.team.name}</span>
              </th>
              <td className="px-2 py-2 text-center tabular-nums">{row.played}</td>
              {!compact && (
                <>
                  <td className="px-2 py-2 text-center tabular-nums">{row.won}</td>
                  <td className="px-2 py-2 text-center tabular-nums">{row.drawn}</td>
                  <td className="px-2 py-2 text-center tabular-nums">{row.lost}</td>
                </>
              )}
              <td className="px-2 py-2 text-center tabular-nums">{formatGoalDifference(row)}</td>
              <td className="px-4 py-2 text-center font-bold tabular-nums">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 pb-3 pt-1 text-[11px] text-line/40">
        <span className="text-emerald-400">▎</span> Qualified ·{" "}
        <span className="text-gold">▎</span> In contention
      </p>
    </div>
  );
}
