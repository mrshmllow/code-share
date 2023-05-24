import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Provider } from "./Provider";
import { z } from "zod";

export default async function GistLayout({
  params: { gist_id },
  children,
}: {
  params: {
    gist_id: string;
  };
  children: ReactNode;
}) {
  const checkedGistId = await z.string().uuid().safeParseAsync(gist_id)

  if (!checkedGistId.success) return notFound();

  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, gist_id),
  });

  if (gist === undefined) return notFound();

  return <Provider gist={gist}>{children}</Provider>;
}
