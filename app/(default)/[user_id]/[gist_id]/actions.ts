"use server";

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { index } from "@/lib/algolia";
import { getServerActionSession } from "@/lib/getServerActionSession";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateName({ id, name }: { id: string; name: string }) {
  const session = await getServerActionSession();

  if (!session?.user?.id) return;

  const gist = await db
    .update(gists)
    .set({
      name,
      aiCompleted: true,
    })
    .where(and(eq(gists.owner, session.user.id), eq(gists.id, id)))
    .returning({
      name: gists.name,
      visible: gists.visible,
    });

  if (gist[0]?.visible) {
    await index.partialUpdateObject({
      objectID: id,
      name: name,
    });
  }

  revalidatePath(`/${session.user.id}/${id}`);
}

export async function updateLanguage({
  id,
  language,
}: {
  id: string;
  language: string;
}) {
  const session = await getServerActionSession();

  if (!session?.user?.id) return;

  const gist = await db
    .update(gists)
    .set({
      language,
    })
    .where(and(eq(gists.owner, session.user.id), eq(gists.id, id)))
    .returning({
      name: gists.name,
      visible: gists.visible,
    });

  if (gist[0]?.visible) {
    await index.partialUpdateObject({
      objectID: id,
      language,
    });
  }

  revalidatePath(`/${session.user.id}/${id}`);
}

export async function changeVisibilty({
  id,
  visibilty,
}: {
  id: string;
  visibilty: boolean;
}) {
  const session = await getServerActionSession();

  if (!session?.user?.id) return;

  const gist = await db
    .update(gists)
    .set({
      visible: visibilty,
    })
    .where(and(eq(gists.owner, session.user.id), eq(gists.id, id)))
    .returning({
      name: gists.name,
      visible: gists.visible,
      text: gists.text,
      tags: gists.aiTags,
      language: gists.language,
    });

  if (visibilty && gist[0]) {
    const text = gist[0].text.split("\n").slice(0, 10).join("\n");

    // Add a newly visible gist
    await index.saveObject({
      objectID: id,
      name: gist[0].name,
      owner: session.user.id,
      tags: gist[0].tags && gist[0].tags.split(","),
      language: gist[0].language,
      text,
    });
  } else {
    // Remove newly invisible gist from search results
    await index.deleteObject(id);
  }

  redirect(`/${session.user.id}/${id}`);
}
