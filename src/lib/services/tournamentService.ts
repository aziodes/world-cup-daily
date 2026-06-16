// Data service layer. Every page reads through these functions.
//
// Live integration: set FOOTBALL_DATA_API_KEY in your environment (e.g.
// Vercel project settings) to switch from mock data to football-data.org's
// free-tier World Cup feed. If the key is missing, or a request fails for
// any reason (rate limit, brief outage, typo in the key), every function
// below falls back to the original mock data automatically — the site
// never breaks, it just quietly goes back to demo data.

import { mockMatches } from "@/lib/data/mockMatches";
import { mockGroups } from "@/lib/data/mockStandings";
import { mockBracket } from "@/lib/data/mockBracket";
import { mockCleanSheets, mockDailySummary, mockScorers } from "@/lib/data/mockStats";
import type {
  BracketRound,
  BracketTie,
  CleanSheetEntry,
  DailySummary,
  Group,
  Match,
  MatchStatus,
  Qualification,
  ScorerEntry,
  StandingsRow,
  Team,
} from "@/lib/types/tournament";
import { isSameLocalDay, isWithinNextDays } from "@/lib/format/dates";

const FD_BASE = "https://api.football-data.org/v4";
const COMPETITION = "WC"; // FIFA World Cup, included in football-data.org's free tier.

function hasApiKey(): boolean {
  return Boolean(process.env.FOOTBALL_DATA_API_KEY);
}

async function fdFetch(path: string, revalidateSeconds: number): Promise<Response> {
  const res = await fetch(`${FD_BASE}${path}`, {
    headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY as string },
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) {
    throw new Error(`football-data.org request failed: ${res.status} ${path}`);
  }
  return res;
}

// --- emoji flags for live data -------------------------------------------
// football-data.org gives crest image URLs, not emoji, and the existing UI
// expects a short emoji string. This covers the teams most likely to be in
// the tournament; anything missing falls back to its three-letter code.
const FLAGS: Record<string, string> = {
  Mexico: "🇲🇽", "South Africa": "🇿🇦",
  "South Korea": "🇰🇷", "Korea Republic": "🇰🇷",
  Czechia: "🇨🇿", "Czech Republic": "🇨🇿",
  Netherlands: "🇳🇱", "United States": "🇺🇸", USA: "🇺🇸",
  Canada: "🇨🇦", "Bosnia and Herzegovina": "🇧🇦", Paraguay: "🇵🇾",
  Qatar: "🇶🇦", Switzerland: "🇨🇭", Brazil: "🇧🇷", Morocco: "🇲🇦",
  Japan: "🇯🇵", Argentina: "🇦🇷", France: "🇫🇷", Germany: "🇩🇪",
  Spain: "🇪🇸", Portugal: "🇵🇹", Belgium: "🇧🇪", Croatia: "🇭🇷",
  Algeria: "🇩🇿", Australia: "🇦🇺", "New Zealand": "🇳🇿", Tunisia: "🇹🇳",
  Senegal: "🇸🇳", Iran: "🇮🇷", "Saudi Arabia": "🇸🇦", Ecuador: "🇪🇨",
  Uruguay: "🇺🇾", Colombia: "🇨🇴", Ghana: "🇬🇭", Egypt: "🇪🇬",
  Jordan: "🇯🇴", Haiti: "🇭🇹", Norway: "🇳🇴", Italy: "🇮🇹",
  Poland: "🇵🇱", Ukraine: "🇺🇦", Serbia: "🇷🇸", Austria: "🇦🇹",
  Panama: "🇵🇦", "Ivory Coast": "🇨🇮", "Cabo Verde": "🇨🇻", Iraq: "🇮🇶",
  "New Caledonia": "🇳🇨", Curacao: "🇨🇼", Jamaica: "🇯🇲", Uzbekistan: "🇺🇿",
};

function flagFor(name: string, tla?: string): string {
  return FLAGS[name] ?? tla ?? name.slice(0, 3).toUpperCase();
}

// --- mapping raw football-data.org payloads onto our own types -----------

function mapTeam(raw: any): Team {
  return {
    id: String(raw.id),
    name: raw.name,
    code: raw.tla ?? raw.shortName ?? raw.name.slice(0, 3).toUpperCase(),
    flag: flagFor(raw.name, raw.tla),
  };
}

const STATUS_MAP: Record<string, MatchStatus> = {
  SCHEDULED: "scheduled",
  TIMED: "scheduled",
  IN_PLAY: "live",
  PAUSED: "halftime",
  FINISHED: "fulltime",
  AWARDED: "fulltime",
  POSTPONED: "postponed",
  SUSPENDED: "delayed",
  CANCELLED: "delayed",
};

function mapMatch(raw: any): Match {
  const status = STATUS_MAP[raw.status] ?? "scheduled";
  const ft = raw.score?.fullTime;
  const hasScore = ft && (ft.home != null || ft.away != null);
  const stageLabel = raw.group
    ? `Group ${String(raw.group).replace("GROUP_", "")}`
    : String(raw.stage ?? "").replace(/_/g, " ");
  return {
    id: String(raw.id),
    stage: stageLabel,
    kickoffUtc: raw.utcDate,
    venue: raw.venue ?? "Venue TBC",
    city: "", // football-data.org doesn't separate city from venue name.
    status,
    minute: typeof raw.minute === "number" ? raw.minute : undefined,
    home: mapTeam(raw.homeTeam),
    away: mapTeam(raw.awayTeam),
    score: hasScore ? { home: ft.home ?? 0, away: ft.away ?? 0 } : undefined,
  };
}

function mapStageToBracketRound(stage: string): BracketRound | null {
  const s = stage.toUpperCase();
  if (s.includes("FINAL") && !s.includes("SEMI") && !s.includes("QUARTER")) return "final";
  if (s.includes("SEMI")) return "semifinal";
  if (s.includes("QUARTER")) return "quarterfinal";
  if (s.includes("16")) return "round-of-16";
  if (s.includes("32")) return "round-of-32";
  return null;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// --- fetch helpers ---------------------------------------------------------

async function fetchWindowMatches(): Promise<any[]> {
  const now = new Date();
  const from = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
  // football-data.org's dateTo is exclusive, so this is padded by a day.
  const to = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
  const res = await fdFetch(
    `/competitions/${COMPETITION}/matches?dateFrom=${isoDate(from)}&dateTo=${isoDate(to)}`,
    30
  );
  const data = await res.json();
  return data.matches ?? [];
}

async function fetchSeasonMatchesRaw(): Promise<any[]> {
  const res = await fdFetch(`/competitions/${COMPETITION}/matches`, 1800);
  const data = await res.json();
  return data.matches ?? [];
}

// --- public service functions ----------------------------------------------

export async function getAllMatches(): Promise<Match[]> {
  if (!hasApiKey()) return mockMatches;
  try {
    const matches = (await fetchWindowMatches()).map(mapMatch);
    return matches.length > 0 ? matches : mockMatches;
  } catch (err) {
    console.error("getAllMatches: falling back to mock data", err);
    return mockMatches;
  }
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

function qualificationFor(position: number, played: number): Qualification {
  const GROUP_STAGE_MATCHES = 3; // 12 groups of 4 teams, round-robin, in the 2026 format.
  if (played < GROUP_STAGE_MATCHES) return "in-contention";
  if (position <= 2) return "qualified";
  if (position === 3) return "in-contention"; // depends on the best-third-place comparison across all 12 groups.
  return "eliminated";
}

export async function getGroups(): Promise<Group[]> {
  if (!hasApiKey()) return mockGroups;
  try {
    const res = await fdFetch(`/competitions/${COMPETITION}/standings`, 3600);
    const data = await res.json();
    const raw = (data.standings ?? []).filter((s: any) => s.type === "TOTAL");
    const groups: Group[] = raw.map((g: any) => ({
      name: g.group ? `Group ${String(g.group).replace("GROUP_", "")}` : "Group",
      rows: g.table.map((row: any): StandingsRow => ({
        team: mapTeam(row.team),
        played: row.playedGames,
        won: row.won,
        drawn: row.draw,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        points: row.points,
        qualification: qualificationFor(row.position, row.playedGames),
      })),
    }));
    return groups.length > 0 ? groups : mockGroups;
  } catch (err) {
    console.error("getGroups: falling back to mock data", err);
    return mockGroups;
  }
}

export async function getBracket(): Promise<BracketTie[]> {
  if (!hasApiKey()) return mockBracket;
  try {
    const raw = (await fetchSeasonMatchesRaw()).filter(
      (m: any) => m.stage && m.stage !== "GROUP_STAGE"
    );
    const ties = raw
      .map((m: any): BracketTie | null => {
        const round = mapStageToBracketRound(m.stage);
        if (!round) return null;
        const home = m.homeTeam ? mapTeam(m.homeTeam) : undefined;
        const away = m.awayTeam ? mapTeam(m.awayTeam) : undefined;
        const ft = m.score?.fullTime;
        const hasScore = ft && (ft.home != null || ft.away != null);
        const winnerId =
          m.score?.winner === "HOME_TEAM" ? home?.id :
          m.score?.winner === "AWAY_TEAM" ? away?.id : undefined;
        return {
          id: String(m.id),
          round,
          home,
          away,
          kickoffUtc: m.utcDate,
          score: hasScore ? { home: ft.home ?? 0, away: ft.away ?? 0 } : undefined,
          winnerId,
        };
      })
      .filter((t: BracketTie | null): t is BracketTie => t !== null);
    // An empty array is expected (and correct) until the knockout rounds are drawn.
    return ties;
  } catch (err) {
    console.error("getBracket: falling back to mock data", err);
    return mockBracket;
  }
}

export async function getTopScorers(limit = 10): Promise<ScorerEntry[]> {
  if (!hasApiKey()) return mockScorers;
  try {
    const res = await fdFetch(`/competitions/${COMPETITION}/scorers?limit=${limit}`, 3600);
    const data = await res.json();
    const scorers: ScorerEntry[] = (data.scorers ?? []).map((s: any) => ({
      player: s.player?.name ?? "Unknown",
      team: mapTeam(s.team),
      goals: s.goals ?? 0,
      assists: s.assists ?? 0,
    }));
    return scorers.length > 0 ? scorers : mockScorers;
  } catch (err) {
    console.error("getTopScorers: falling back to mock data", err);
    return mockScorers;
  }
}

export async function getCleanSheets(limit = 10): Promise<CleanSheetEntry[]> {
  if (!hasApiKey()) return mockCleanSheets;
  try {
    // football-data.org's free tier has no goalkeeper-level data, so this
    // tracks clean sheets at the team level instead of a named player.
    const matches = (await fetchSeasonMatchesRaw()).map(mapMatch);
    const finished = matches.filter((m) => m.status === "fulltime" && m.score);
    const tally = new Map<string, { team: Team; cleanSheets: number; matchesPlayed: number }>();
    for (const m of finished) {
      (["home", "away"] as const).forEach((side) => {
        const team = m[side];
        const conceded = side === "home" ? m.score!.away : m.score!.home;
        const entry = tally.get(team.id) ?? { team, cleanSheets: 0, matchesPlayed: 0 };
        entry.matchesPlayed += 1;
        if (conceded === 0) entry.cleanSheets += 1;
        tally.set(team.id, entry);
      });
    }
    const entries: CleanSheetEntry[] = Array.from(tally.values())
      .filter((e) => e.cleanSheets > 0)
      .map((e) => ({
        player: e.team.name,
        team: e.team,
        cleanSheets: e.cleanSheets,
        matchesPlayed: e.matchesPlayed,
      }))
      .sort((a, b) => b.cleanSheets - a.cleanSheets || a.matchesPlayed - b.matchesPlayed)
      .slice(0, limit);
    return entries;
  } catch (err) {
    console.error("getCleanSheets: falling back to mock data", err);
    return mockCleanSheets;
  }
}

export async function getDailySummary(): Promise<DailySummary> {
  // No free API gives editorial "today's digest" text — this is exactly the
  // gap an RSS feed (BBC Sport, ESPN) would fill. Left as-is for now.
  return mockDailySummary;
}
