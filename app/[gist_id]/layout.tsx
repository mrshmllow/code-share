import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Provider } from "./Provider";
import { z } from "zod";
import { getHighlighter } from "shiki";
import { sanitize_html } from "@/wasm/pkg/wasm";

async function isUUID(str: string) {
  return (await z.string().uuid().safeParseAsync(str)).success;
}

export default async function GistLayout({
  params: { gist_id },
  children,
}: {
  params: {
    gist_id: string;
  };
  children: ReactNode;
}) {
  if (!isUUID(gist_id)) return notFound();

  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, gist_id),
  });

  if (gist === undefined) return notFound();

  const highlighter = await getHighlighter({
    theme: "css-variables",
  });

  const html = highlighter.codeToHtml(sanitize_html(gist.text), {
    theme: "css-variables",
    lang: "rust"
  });

  return (
    <Provider gist={gist} html={html}>
      {children}
    </Provider>
  );
}
