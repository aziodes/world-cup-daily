import { getGroups } from "@/lib/services/tournamentService";

export async function GET() {
  const groups = await getGroups();
  return Response.json({ groups });
}
