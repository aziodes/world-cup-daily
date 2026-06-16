// Data service layer. Every page reads through these functions, so
// swapping mock data for a live API is a change in ONE file.
//
// Live integration later:
//   - Replace each function body with `fetch(...)` against your provider
//     (e.g. football-data.org's free tier or the official FIFA endpoints).
//   - Add `{ next: { revalidate: 30 } }` to fetch options for ISR-style
//     caching of live scores, or `revalidate: 3600` for standings.
//   - Keep the return types identical; map provider payloads to the
//     types in `@/lib/types/tournament` inside this file only.

import { mockMatches } from "@/lib/data/mockMatches";
import { mockGroups } from "@/lib/data/mockStandings";
import { mockBracket } from "@/lib/data/mockBracket";
import { mockCleanSheets, mockDailySummary, mockScorers } from "@/lib/data/mockStats";
import type {
  BracketTie,
  CleanSheetEntry,
  DailySummary,
  Group,
  Match,
  ScorerEntry,
} from "@/lib/types/tournament";
import { isSameLocalDay, isWithinNextDays } from "@/lib/format/dates";

export async function getAllMatches(): Promise<Match[]> {
  return mockMatches;
}

export async function getTodaysMatches(now: Date = new Date()): Promise<Match[]> {
  const matches = await getAllMatches();
  return matches.filter(
    (m) =>
      m.status === "live" ||
      m.status === "halftime" ||
      isSameLocalDay(m.kickoffUtc, now.toISOString())
  );
}

export async function getUpcomingFixtures(days = 3, now: Date = new Date()): Promise<Match[]> {
  const matches = await getAllMatches();
  return matches
    .filter((m) => m.status === "scheduled" && isWithinNextDays(m.kickoffUtc, days, now))
    .sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
}

export async function getLatestResults(limit = 5): Promise<Match[]> {
  const matches = await getAllMatches();
  return matches
    .filter((m) => m.status === "fulltime")
    .sort((a, b) => b.kickoffUtc.localeCompare(a.kickoffUtc))
    .slice(0, limit);
}

export async function getGroups(): Promise<Group[]> {
  return mockGroups;
}

export async function getBracket(): Promise<BracketTie[]> {
  return mockBracket;
}

export async function getTopScorers(limit = 10): Promise<ScorerEntry[]> {
  return [...mockScorers]
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, limit);
}

export async function getCleanSheets(limit = 10): Promise<CleanSheetEntry[]> {
  return [...mockCleanSheets]
    .sort((a, b) => b.cleanSheets - a.cleanSheets || a.matchesPlayed - b.matchesPlayed)
    .slice(0, limit);
}

export async function getDailySummary(): Promise<DailySummary> {
  return mockDailySummary;
}
