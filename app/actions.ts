"use server";

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { qstash } from "@/lib/messaging/qstash";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export async function createGist(text: string) {
  const gist = await db
    .insert(gists)
    .values({
      id: nanoid(),
      text,
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
