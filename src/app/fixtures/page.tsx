import type { Metadata } from "next";
import { FilterBar } from "@/components/sports/FilterBar";
import { getAllMatches } from "@/lib/services/tournamentService";

export const metadata: Metadata = {
  title: "Fixtures & results",
  description: "Every FIFA World Cup 2026 fixture and result, in your local timezone.",
};

export default async function FixturesPage() {
  const matches = await getAllMatches();
  const sorted = [...matches].sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Fixtures &amp; results</h1>
      {/* Server fetches the data; the client FilterBar only handles filter state. */}
      <FilterBar matches={sorted} />
    </div>
  );
}
