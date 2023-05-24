import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = Infinity;

export async function GET(
  _: NextRequest,
  {
    params: { gist_id },
  }: {
    params: {
      gist_id: string;
    };
  }
) {
  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, Number(gist_id)),
    columns: {
      name: true,
      aiNameReason: true
    },
  });

  if (gist === undefined)
    return NextResponse.json(
      {
        name: null,
        aiNameReason: null,
        error: "not found",
      },
      {
        status: 404,
      }
    );

  return NextResponse.json({
    ...gist,
    now: Date.now(),
  });
}
