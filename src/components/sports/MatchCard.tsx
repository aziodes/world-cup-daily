import type { Match } from "@/lib/types/tournament";
import { Card } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/Chip";
import { KickoffTime } from "@/components/sports/KickoffTime";

function TeamRow({
  name,
  code,
  flag,
  score,
  emphasize,
}: {
  name: string;
  code: string;
  flag: string;
  score?: number;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-2">
        <span aria-hidden="true">{flag}</span>
        <span className={emphasize ? "truncate font-semibold" : "truncate text-line/80"}>
          <span className="sm:hidden">{code}</span>
          <span className="hidden sm:inline">{name}</span>
        </span>
      </span>
      {score != null && (
        <span className={`tabular-nums text-lg ${emphasize ? "font-bold" : "text-line/70"}`}>
          {score}
        </span>
      )}
    </div>
  );
}

export function MatchCard({ match }: { match: Match }) {
  const hasScore = match.score != null;
  const homeLeads = hasScore && match.score!.home > match.score!.away;
  const awayLeads = hasScore && match.score!.away > match.score!.home;

  return (
    <Card as="article" className="space-y-2">
      <header className="flex items-center justify-between gap-2 text-xs text-line/60">
        <span>{match.stage}</span>
        <StatusChip status={match.status} minute={match.minute} />
      </header>
      <h3 className="sr-only">
        {match.home.name} vs {match.away.name}, {match.stage}
      </h3>
      <div className="space-y-1.5">
        <TeamRow {...match.home} score={match.score?.home} emphasize={homeLeads} />
        <TeamRow {...match.away} score={match.score?.away} emphasize={awayLeads} />
      </div>
      <footer className="flex items-center justify-between gap-2 border-t border-white/5 pt-2 text-xs text-line/50">
        <span className="truncate">{match.venue}, {match.city}</span>
        {match.status === "scheduled" && <KickoffTime kickoffUtc={match.kickoffUtc} />}
      </footer>
    </Card>
  );
}
