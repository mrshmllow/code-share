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
  const [gist, session] = await Promise.all([
    db.query.gists.findFirst({
      where: and(eq(gists.id, gist_id), eq(gists.owner, user_id))
    }),
    getServerSession(authOptions),
  ]);

  const owns = gist?.owner === session?.user?.id;

  // you must be owner OR the gist must be visible
  if (gist === undefined || (!owns && !gist.visible)) return notFound();

  const highlight = hljs.highlightAuto(
    sanitize(gist.text),
    gist.language ? [gist.language] : undefined
  );

  const lang = highlight.language ? highlight.language : gist.language

  return (
    <Provider
      language={lang}
      gist={gist}
      html={highlight.value}
      session={session}
    >
      <NewGistPopup />
      <div className="max-w-4xl w-full">{children}</div>
    </Provider>
  );
}
