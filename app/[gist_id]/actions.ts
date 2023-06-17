'use server';

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function updateName({
  id,
  name
}: {
  id: string;
  name: string;
}) {
  // const session = await getServerSession(authOptions)

  // if (!session) {
  //   return
  // }

  await db.update(gists).set({
    name
  }).where(and(
    // eq(gists.owner, session.user.id),
    eq(gists.id, id)
  ))

  // revalidatePath(`/${id}`)
}
