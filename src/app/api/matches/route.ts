import { getAllMatches } from "@/lib/services/tournamentService";

// Placeholder API route. Useful for client-side polling of live scores later:
// poll `/api/matches` every ~30s from a small client component on matchdays.
export async function GET() {
  const matches = await getAllMatches();
  return Response.json({ matches });
}
