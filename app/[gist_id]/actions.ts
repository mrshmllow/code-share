"use server";

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { getServerActionSession } from "@/lib/getServerActionSession";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateName({ id, name }: { id: string; name: string }) {
  const session = await getServerActionSession();

  if (!session?.user?.id) return;

  await db
    .update(gists)
    .set({
      name,
    })
    .where(and(eq(gists.owner, session.user.id), eq(gists.id, id)));

  revalidatePath(`/${id}`)
}

export async function changeVisibilty({ id, visibilty }: { id: string; visibilty: boolean }) {
  const session = await getServerActionSession();

  if (!session?.user?.id) return;

  await db
    .update(gists)
    .set({
      visible: visibilty
    })
    .where(and(eq(gists.owner, session.user.id), eq(gists.id, id)));

  redirect(`/${id}`)
}
