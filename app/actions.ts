"use server";

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { getServerActionSession } from "@/lib/getServerActionSession";
import { qstash } from "@/lib/messaging/qstash";
import { nanoid } from "nanoid/async";
import { redirect } from "next/navigation";
import { env } from "./env.mjs";
import hljs from "highlight.js";

const IS_PROD = process.env.NODE_ENV == "production";

export async function createGist(text: string) {
  const session = await getServerActionSession();

  if (!session?.user?.id) return;

  const { language } = hljs.highlightAuto(text);

  const gist = await db
    .insert(gists)
    .values({
      id: await nanoid(),
      text,
      visible: false,
      owner: session.user.id,
      aiCompleted: !IS_PROD,
      language,
    })
    .returning({
      id: gists.id,
    });

  if (!gist[0]) {
    throw new Error("Unable to create gist");
  }

  if (!IS_PROD) {
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

  redirect(`/${session.user.id}/${gist[0].id}?new=true`);
}
