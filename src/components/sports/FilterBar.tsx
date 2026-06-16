"use client";

import { useMemo, useState } from "react";
import type { Match, MatchStatus } from "@/lib/types/tournament";
import { MatchCard } from "@/components/sports/MatchCard";
import { cn } from "@/lib/utils/cn";

const FILTERS: Array<{ label: string; value: MatchStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Live", value: "live" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Finished", value: "fulltime" },
];

/** Client component: the only interactive state on the fixtures page. */
export function FilterBar({ matches }: { matches: Match[] }) {
  const [filter, setFilter] = useState<MatchStatus | "all">("all");

  const visible = useMemo(
    () => (filter === "all" ? matches : matches.filter((m) => m.status === filter)),
    [matches, filter]
  );

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Filter matches by status" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold",
              filter === f.value
                ? "border-gold bg-gold/15 text-gold"
                : "border-white/10 bg-white/5 text-line/70 hover:text-line"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="text-sm text-line/60">No matches with this status yet. Try another filter.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => (
            <li key={m.id}>
              <MatchCard match={m} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
