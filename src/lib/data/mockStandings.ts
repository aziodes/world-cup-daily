import type { Group } from "@/lib/types/tournament";
import { teams } from "@/lib/data/mockMatches";

export const mockGroups: Group[] = [
  {
    name: "Group A",
    rows: [
      {
        team: teams.ned,
        played: 2, won: 2, drawn: 0, lost: 0,
        goalsFor: 5, goalsAgainst: 1, points: 6,
        qualification: "qualified",
      },
      {
        team: teams.mex,
        played: 2, won: 1, drawn: 1, lost: 0,
        goalsFor: 3, goalsAgainst: 2, points: 4,
        qualification: "in-contention",
      },
      {
        team: teams.kor,
        played: 2, won: 0, drawn: 1, lost: 1,
        goalsFor: 1, goalsAgainst: 3, points: 1,
        qualification: "in-contention",
      },
      {
        team: teams.rsa,
        played: 2, won: 0, drawn: 0, lost: 2,
        goalsFor: 1, goalsAgainst: 4, points: 0,
        qualification: "eliminated",
      },
    ],
  },
];
