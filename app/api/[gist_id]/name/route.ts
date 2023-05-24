import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  {
    params: { gist_id },
  }: {
    params: { gist_id: string };
  }
) {
  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, Number(gist_id)),
    columns: {
      name: true,
    },
  });

  if (gist === undefined) {
    return NextResponse.json(
      {
        name: null,
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    name: gist.name,
  });
}
