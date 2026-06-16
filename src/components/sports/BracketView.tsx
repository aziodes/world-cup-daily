import type { BracketRound, BracketTie } from "@/lib/types/tournament";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

const ROUND_ORDER: BracketRound[] = [
  "round-of-32",
  "round-of-16",
  "quarterfinal",
  "semifinal",
  "final",
];

const ROUND_LABELS: Record<BracketRound, string> = {
  "round-of-32": "Round of 32",
  "round-of-16": "Round of 16",
  quarterfinal: "Quarter-finals",
  semifinal: "Semi-finals",
  final: "Final",
};

function TieRow({ tie }: { tie: BracketTie }) {
  const sides = [
    { team: tie.home, score: tie.score?.home },
    { team: tie.away, score: tie.score?.away },
  ];
  return (
    <Card as="li" className="min-w-[200px] space-y-1 p-3 text-sm">
      {sides.map((side, i) => {
        const isWinner = side.team && tie.winnerId === side.team.id;
        return (
          <div
            key={side.team?.id ?? i}
            className={cn(
              "flex items-center justify-between gap-2",
              isWinner ? "font-bold" : tie.winnerId ? "text-line/50" : ""
            )}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{side.team?.flag ?? "·"}</span>
              <span>{side.team?.name ?? "To be decided"}</span>
              {isWinner && <span className="sr-only">(winner)</span>}
            </span>
            {side.score != null && <span className="tabular-nums">{side.score}</span>}
          </div>
        );
      })}
    </Card>
  );
}

/**
 * Mobile-first bracket: each round is a horizontally scrollable column band.
 * On large screens the rounds sit side by side like a classic bracket.
 */
export function BracketView({ ties }: { ties: BracketTie[] }) {
  const rounds = ROUND_ORDER.filter((r) => ties.some((t) => t.round === r));
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      {rounds.map((round) => (
        <section key={round} aria-labelledby={`round-${round}`} className="lg:flex-1">
          <h3
            id={`round-${round}`}
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold"
          >
            {ROUND_LABELS[round]}
          </h3>
          <ul className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {ties
              .filter((t) => t.round === round)
              .map((tie) => (
                <TieRow key={tie.id} tie={tie} />
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
