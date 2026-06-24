import type { Metadata } from "next";
import { StandingsTable } from "@/components/sports/StandingsTable";
import { getGroups } from "@/lib/services/tournamentService";
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Group standings",
  description: "FIFA World Cup 2026 group tables with qualification status.",
};

export default async function StandingsPage() {
  const groups = await getGroups();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Group standings</h1>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => (
          <StandingsTable key={g.name} group={g} />
        ))}
      </div>
    </div>
  );
}
