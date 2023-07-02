"use server";

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { getServerActionSession } from "@/lib/getServerActionSession";
import { qstash } from "@/lib/messaging/qstash";
import { nanoid } from "nanoid/async";
import { redirect } from "next/navigation";
import { env } from "./env.mjs";

const IS_DEV = process.env.NODE_ENV == "production"

export async function createGist(text: string) {
  const session = await getServerActionSession();

  if (!session?.user?.id) return;

  const gist = await db
    .insert(gists)
    .values({
      id: await nanoid(),
      text,
      visible: false,
      owner: session.user.id,
      aiCompleted: IS_DEV
    })
    .returning({
      id: gists.id,
    });

  if (!IS_DEV) {
    console.log("Skipping qstash publish in dev mode");
  } else {
    const url = new URL(env.NEXTAUTH_URL);
    url.pathname = `/api/gen/name`;

    await qstash.publishJSON({
      url: url.toString(),
      body: {
        gistId: gist[0].id,
      },
      retries: 1,
      contentBasedDeduplication: true,
    });
  }

  redirect(`/${gist[0].id}?new=true`);
}
