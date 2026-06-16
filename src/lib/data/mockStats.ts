import type { CleanSheetEntry, DailySummary, ScorerEntry } from "@/lib/types/tournament";
import { teams } from "@/lib/data/mockMatches";

export const mockScorers: ScorerEntry[] = [
  { player: "Santiago Giménez", team: teams.mex, goals: 4, assists: 1 },
  { player: "Cody Gakpo", team: teams.ned, goals: 3, assists: 2 },
  { player: "Folarin Balogun", team: teams.usa, goals: 3, assists: 0 },
];

export const mockCleanSheets: CleanSheetEntry[] = [
  { player: "Bart Verbruggen", team: teams.ned, cleanSheets: 2, matchesPlayed: 2 },
  { player: "Zion Suzuki", team: teams.jpn, cleanSheets: 1, matchesPlayed: 2 },
];

export const mockDailySummary: DailySummary = {
  date: "2026-06-11",
  headline: "Hosts hold their nerve at the Azteca",
  bullets: [
    "Mexico lead South Africa 2–1 with the Azteca crowd in full voice.",
    "Netherlands top Group A after a commanding win in Vancouver.",
    "Korea face the Dutch tomorrow needing at least a point to stay alive.",
  ],
};
