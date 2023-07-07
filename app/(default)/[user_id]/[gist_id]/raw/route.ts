import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _: Request,
  { params: { gist_id } }: { params: { gist_id: string } }
) {
  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, gist_id),
  });

  if (gist === undefined) {
    return new Response("Snippet not found", { status: 404 });
  }

  return new Response(gist.text);
}
