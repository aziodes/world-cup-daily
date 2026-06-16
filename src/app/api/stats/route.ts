import { getCleanSheets, getTopScorers } from "@/lib/services/tournamentService";

export async function GET() {
  const [scorers, cleanSheets] = await Promise.all([getTopScorers(), getCleanSheets()]);
  return Response.json({ scorers, cleanSheets });
}
