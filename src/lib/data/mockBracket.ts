import type { BracketTie } from "@/lib/types/tournament";
import { teams } from "@/lib/data/mockMatches";

export const mockBracket: BracketTie[] = [
  {
    id: "r16-01",
    round: "round-of-16",
    home: teams.ned,
    away: teams.jpn,
    kickoffUtc: "2026-06-29T20:00:00Z",
    score: { home: 2, away: 0 },
    winnerId: "ned",
  },
  {
    id: "r16-02",
    round: "round-of-16",
    home: teams.usa,
    away: teams.mex,
    kickoffUtc: "2026-06-30T00:00:00Z",
  },
  {
    id: "qf-01",
    round: "quarterfinal",
    home: teams.ned,
    // Away side fills in once r16-02 resolves.
    kickoffUtc: "2026-07-04T20:00:00Z",
  },
];
