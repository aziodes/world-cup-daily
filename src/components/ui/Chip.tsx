import type { MatchStatus } from "@/lib/types/tournament";
import { cn } from "@/lib/utils/cn";

const STATUS_STYLES: Record<MatchStatus, string> = {
  live: "bg-live/15 text-live border-live/40",
  halftime: "bg-live/15 text-live border-live/40",
  scheduled: "bg-white/5 text-line/70 border-white/10",
  fulltime: "bg-white/10 text-line border-white/10",
  postponed: "bg-gold/10 text-gold border-gold/30",
  delayed: "bg-gold/10 text-gold border-gold/30",
};

const STATUS_LABELS: Record<MatchStatus, string> = {
  live: "Live",
  halftime: "HT",
  scheduled: "Scheduled",
  fulltime: "FT",
  postponed: "Postponed",
  delayed: "Delayed",
};

export function StatusChip({ status, minute }: { status: MatchStatus; minute?: number }) {
  const isLive = status === "live" || status === "halftime";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        STATUS_STYLES[status]
      )}
    >
      {isLive && (
        <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
      )}
      {status === "live" && minute != null ? `${minute}′` : STATUS_LABELS[status]}
      {isLive && <span className="sr-only">— match in progress</span>}
    </span>
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-line/70",
        className
      )}
    >
      {children}
    </span>
  );
}
