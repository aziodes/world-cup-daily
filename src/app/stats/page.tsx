import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScorerLeaderboard } from "@/components/sports/ScorerLeaderboard";
import { CleanSheetLeaderboard } from "@/components/sports/CleanSheetLeaderboard";
import { getCleanSheets, getTopScorers } from "@/lib/services/tournamentService";

export const metadata: Metadata = {
  title: "Stats & leaderboards",
  description: "FIFA World Cup 2026 top scorers and clean sheet leaders.",
};

// Leaderboards move after each match.
export const revalidate = 300;

export default async function StatsPage() {
  const [scorers, cleanSheets] = await Promise.all([getTopScorers(), getCleanSheets()]);
  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold">Stats</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-label="Top scorers">
          <SectionHeader eyebrow="Golden Boot" title="Top scorers" />
          <ScorerLeaderboard scorers={scorers} />
        </section>
        <section aria-label="Clean sheets">
          <SectionHeader eyebrow="Golden Glove" title="Clean sheets" />
          <CleanSheetLeaderboard entries={cleanSheets} />
        </section>
      </div>
    </div>
  );
}
