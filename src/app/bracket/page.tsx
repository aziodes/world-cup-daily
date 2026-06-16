import type { Metadata } from "next";
import { BracketView } from "@/components/sports/BracketView";
import { getBracket } from "@/lib/services/tournamentService";

export const metadata: Metadata = {
  title: "Knockout bracket",
  description: "FIFA World Cup 2026 knockout rounds, results and progression.",
};

export default async function BracketPage() {
  const ties = await getBracket();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Knockout bracket</h1>
      <BracketView ties={ties} />
    </div>
  );
}
