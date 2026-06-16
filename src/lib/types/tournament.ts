// Core domain types for World Cup Daily.
// All kick-off times are stored as UTC ISO 8601 strings and
// converted to the viewer's local timezone at render time.

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "fulltime"
  | "postponed"
  | "delayed";

export interface Team {
  id: string;
  name: string;
  /** FIFA three-letter code, e.g. "ARG" */
  code: string;
  /** Emoji flag keeps the scaffold dependency-free; swap for SVG assets later. */
  flag: string;
}

export interface Score {
  home: number;
  away: number;
}

export interface Match {
  id: string;
  /** e.g. "Group A", "Round of 16" */
  stage: string;
  /** ISO 8601 UTC, e.g. "2026-06-11T16:00:00Z" */
  kickoffUtc: string;
  venue: string;
  city: string;
  status: MatchStatus;
  /** Current minute when status is "live" */
  minute?: number;
  home: Team;
  away: Team;
  score?: Score;
}

export type Qualification = "qualified" | "in-contention" | "eliminated";

export interface StandingsRow {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  qualification: Qualification;
}

export interface Group {
  /** e.g. "Group A" */
  name: string;
  rows: StandingsRow[];
}

export type BracketRound =
  | "round-of-32"
  | "round-of-16"
  | "quarterfinal"
  | "semifinal"
  | "final";

export interface BracketTie {
  id: string;
  round: BracketRound;
  /** Undefined until the previous round resolves. */
  home?: Team;
  away?: Team;
  kickoffUtc?: string;
  score?: Score;
  /** Team.id of the winner once decided. */
  winnerId?: string;
}

export interface ScorerEntry {
  player: string;
  team: Team;
  goals: number;
  assists: number;
}

export interface CleanSheetEntry {
  player: string;
  team: Team;
  cleanSheets: number;
  matchesPlayed: number;
}

export interface DailySummary {
  /** Local tournament date, e.g. "2026-06-11" */
  date: string;
  headline: string;
  bullets: string[];
}
