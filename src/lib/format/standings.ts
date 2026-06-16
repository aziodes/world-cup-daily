import type { StandingsRow } from "@/lib/types/tournament";

export function goalDifference(row: StandingsRow): number {
  return row.goalsFor - row.goalsAgainst;
}

/** FIFA group ordering: points, then goal difference, then goals scored. */
export function sortStandings(rows: StandingsRow[]): StandingsRow[] {
  return [...rows].sort(
    (a, b) =>
      b.points - a.points ||
      goalDifference(b) - goalDifference(a) ||
      b.goalsFor - a.goalsFor ||
      a.team.name.localeCompare(b.team.name)
  );
}

export function formatGoalDifference(row: StandingsRow): string {
  const gd = goalDifference(row);
  return gd > 0 ? `+${gd}` : String(gd);
}
