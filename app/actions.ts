"use server";

import { db } from "@/db/db";
import { gists } from "@/db/schema";

export async function submit(form: FormData) {
  await db.insert(gists).values({
    text: "hello world"
  })
}
