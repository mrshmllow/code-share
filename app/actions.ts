"use server";

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { qstash } from "@/lib/messaging/qstash";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { nanoid } from "nanoid/async";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function createGist(text: string) {
  // const session = await getServerSession(authOptions)

  const gist = await db
    .insert(gists)
    .values({
      id: await nanoid(),
      text,
      // owner: session?.user.id
    })
    .returning({
      id: gists.id,
    });

  await qstash.publishJSON({
    topic: "gen_name",
    body: {
      gistId: gist[0].id,
    },
    retries: 1,
    contentBasedDeduplication: true,
  });

  redirect(`/${gist[0].id}`);
}
