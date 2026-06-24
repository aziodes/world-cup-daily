import { SectionHeader } from "@/components/ui/SectionHeader";
import { MatchCard } from "@/components/sports/MatchCard";
import { FixtureStrip } from "@/components/sports/FixtureStrip";
import { StandingsTable } from "@/components/sports/StandingsTable";
import { BracketView } from "@/components/sports/BracketView";
import { ScorerLeaderboard } from "@/components/sports/ScorerLeaderboard";
import { CleanSheetLeaderboard } from "@/components/sports/CleanSheetLeaderboard";
import { DailyDigest } from "@/components/sports/DailyDigest";
import {
  getBracket,
  getCleanSheets,
  getDailySummary,
  getGroups,
  getLatestResults,
  getTodaysMatches,
  getTopScorers,
  getUpcomingFixtures,
} from "@/lib/services/tournamentService";
export const revalidate = 300;

// Server Component dashboard: data fetched once on the server, in parallel.
export default async function HomePage() {
  const [today, upcoming, results, groups, bracket, scorers, cleanSheets, summary] =
    await Promise.all([
      getTodaysMatches(),
      getUpcomingFixtures(3),
      getLatestResults(3),
      getGroups(),
      getBracket(),
      getTopScorers(5),
      getCleanSheets(5),
      getDailySummary(),
    ]);

  return (
    <div className="space-y-8 lg:space-y-10">
      <section aria-labelledby="today-heading">
        <SectionHeader eyebrow="Matchday" title="Today's matches" href="/fixtures" />
        <h2 id="today-heading" className="sr-only">Today&apos;s matches</h2>
        {today.length === 0 ? (
          <p className="text-sm text-line/60">No matches today — see upcoming fixtures below.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {today.map((m) => (
              <li key={m.id}><MatchCard match={m} /></li>
            ))}
          </ul>
        )}
      </section>

      {/* iPad landscape: three working columns instead of stacked sections. */}
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
        <section aria-label="Next three days of fixtures" className="space-y-8 lg:col-span-1">
          <div>
            <SectionHeader eyebrow="Coming up" title="Next 3 days" href="/fixtures" />
            <FixtureStrip matches={upcoming} />
          </div>
          <div>
            <SectionHeader eyebrow="The digest" title="Today in 30 seconds" />
            <DailyDigest summary={summary} />
          </div>
        </section>

        <section aria-label="Latest results and group standings" className="space-y-8 lg:col-span-1">
          <div>
            <SectionHeader eyebrow="Final whistle" title="Latest results" href="/fixtures" />
            <ul className="grid gap-3">
              {results.map((m) => (
                <li key={m.id}><MatchCard match={m} /></li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader eyebrow="Group stage" title="Standings" href="/standings" />
            <StandingsTable group={groups[0]} compact />
          </div>
        </section>

        <section aria-label="Top scorers and clean sheets" className="space-y-8 lg:col-span-1">
          <div>
            <SectionHeader eyebrow="Golden Boot" title="Top scorers" href="/stats" />
            <ScorerLeaderboard scorers={scorers} />
          </div>
          <div>
            <SectionHeader eyebrow="Golden Glove" title="Clean sheets" href="/stats" />
            <CleanSheetLeaderboard entries={cleanSheets} />
          </div>
        </section>
      </div>

      <section aria-label="Knockout bracket snapshot">
        <SectionHeader eyebrow="Knockouts" title="Road to the final" href="/bracket" />
        <BracketView ties={bracket} />
      </section>
    </div>
  );
}
