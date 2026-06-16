import type { Match, Team } from "@/lib/types/tournament";

export const teams: Record<string, Team> = {
  mex: { id: "mex", name: "Mexico", code: "MEX", flag: "🇲🇽" },
  rsa: { id: "rsa", name: "South Africa", code: "RSA", flag: "🇿🇦" },
  kor: { id: "kor", name: "South Korea", code: "KOR", flag: "🇰🇷" },
  ned: { id: "ned", name: "Netherlands", code: "NED", flag: "🇳🇱" },
  usa: { id: "usa", name: "United States", code: "USA", flag: "🇺🇸" },
  jpn: { id: "jpn", name: "Japan", code: "JPN", flag: "🇯🇵" },
};

// NOTE: kickoffUtc is always UTC. Never store local times in data.
export const mockMatches: Match[] = [
  {
    id: "m-001",
    stage: "Group A",
    kickoffUtc: "2026-06-11T19:00:00Z",
    venue: "Estadio Azteca",
    city: "Mexico City",
    status: "live",
    minute: 63,
    home: teams.mex,
    away: teams.rsa,
    score: { home: 2, away: 1 },
  },
  {
    id: "m-002",
    stage: "Group A",
    kickoffUtc: "2026-06-12T01:00:00Z",
    venue: "Estadio Akron",
    city: "Guadalajara",
    status: "scheduled",
    home: teams.kor,
    away: teams.ned,
  },
  {
    id: "m-003",
    stage: "Group D",
    kickoffUtc: "2026-06-13T22:00:00Z",
    venue: "SoFi Stadium",
    city: "Los Angeles",
    status: "scheduled",
    home: teams.usa,
    away: teams.jpn,
  },
  {
    id: "m-000",
    stage: "Group A",
    kickoffUtc: "2026-06-10T20:00:00Z",
    venue: "BC Place",
    city: "Vancouver",
    status: "fulltime",
    home: teams.ned,
    away: teams.rsa,
    score: { home: 3, away: 0 },
  },
];
