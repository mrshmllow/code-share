"use server";

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import StoreInitalizer from "@/lib/StoreInitalize";
import { eq } from "drizzle-orm";
import hljs from "highlight.js";
import { sanitize } from "isomorphic-dompurify";
import { notFound } from "next/navigation";
import { useiFrameStore } from "./store";

export default async function IFrameLayout({
  children,
  params: { gist_id },
}: {
  children: React.ReactNode;
  params: {
    gist_id: string;
  };
}) {
  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, gist_id),
  });

  if (gist === undefined || !gist.visible) return notFound();

  const highlight = hljs.highlightAuto(
    gist.text,
    gist.language ? [gist.language] : undefined
  );

  const language = highlight.language ? highlight.language : gist.language;
  return (
    <>
      <StoreInitalizer
        store={useiFrameStore}
        state={{
          ...gist,
          language,
          html: sanitize(highlight.value),
        }}
      />
      {children}
    </>
  );
}
