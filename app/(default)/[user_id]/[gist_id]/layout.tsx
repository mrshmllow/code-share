import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { sanitize } from "isomorphic-dompurify";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Provider } from "./Provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import hljs from "highlight.js";
import NewGistPopup from "./NewGistPopup";
import { Metadata } from "next";

export async function generateMetadata({
  params: { gist_id, user_id },
}: {
  params: { gist_id: string; user_id: string };
}): Promise<Metadata> {
  const snippet = await db.query.gists.findFirst({
    where: and(eq(gists.id, gist_id), eq(gists.owner, user_id)),
  });

  if (!snippet || !snippet?.visible) return {};

  const url = new URL(`https://snip.cafe/og/${snippet.id}`);

  url.searchParams.set("snippet_content", snippet.text);
  if (snippet.language) url.searchParams.set("snippet_lang", snippet.language);
  if (snippet.name) url.searchParams.set("snippet_name", snippet.name);

  return {
    title: snippet.name ? `${snippet.name} | Snip.Cafe` : null,
    openGraph: {
      images: [url.toString()],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function GistLayout({
  params: { gist_id, user_id },
  children,
}: {
  params: {
    gist_id: string;
    user_id: string;
  };
  children: ReactNode;
}) {
  const [snippet, session] = await Promise.all([
    db.query.gists.findFirst({
      where: and(eq(gists.id, gist_id), eq(gists.owner, user_id)),
    }),
    getServerSession(authOptions),
  ]);

  const owns = snippet?.owner === session?.user?.id;

  // you must be owner OR the gist must be visible
  if (snippet === undefined || (!owns && !snippet.visible)) return notFound();

  const highlight = hljs.highlightAuto(
    snippet.text,
    snippet.language ? [snippet.language] : undefined
  );

  const lang = highlight.language ? highlight.language : snippet.language;

  return (
    <Provider
      language={lang}
      gist={snippet}
      html={sanitize(highlight.value)}
      session={session}
    >
      <NewGistPopup />
      <div className="max-w-4xl w-full">{children}</div>
    </Provider>
  );
}
