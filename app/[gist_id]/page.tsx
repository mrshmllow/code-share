"use server"

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function GistPage({
  params: { gist_id },
}: {
  params: {
    gist_id: string;
  };
}) {
  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, Number(gist_id)),
  });

  if (gist === undefined) return notFound();

  return <div>
    {JSON.stringify(gist)}
    <div>
      {gist.text}
    </div>
  </div>;
}
