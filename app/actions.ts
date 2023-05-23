"use server";

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import qstash from "@/lib/messaging/qstash";
import { redirect } from "next/navigation";

export async function createGist(text: string) {
  const gist = await db
    .insert(gists)
    .values({
      text,
    })
    .returning({
      id: gists.id,
    });

  await qstash.publishJSON({
    url: "https://79bf-159-196-152-204.ngrok-free.app/api/gen/name",
    body: {
      gistId: gist[0].id,
    },
  });

  redirect(`/${gist[0].id}`);
}
