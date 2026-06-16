import type { DailySummary } from "@/lib/types/tournament";
import { Card } from "@/components/ui/Card";

export function DailyDigest({ summary }: { summary: DailySummary }) {
  return (
    <Card as="article" className="space-y-3 border-gold/20">
      <h3 className="font-display text-xl font-bold leading-snug">{summary.headline}</h3>
      <ul className="space-y-1.5 text-sm text-line/80">
        {summary.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span aria-hidden="true" className="text-gold">▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
