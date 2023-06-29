import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sanitize } from "isomorphic-dompurify";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Provider } from "./Provider";
import { getHighlighter } from "shiki";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import NewGistPopup from "./NewGistPopup";

export default async function GistLayout({
  params: { gist_id },
  children,
}: {
  params: {
    gist_id: string;
  };
  children: ReactNode;
}) {
  const [gist, session] = await Promise.all([
    db.query.gists.findFirst({
      where: eq(gists.id, gist_id),
    }),
    getServerSession(authOptions),
  ]);

  const owns = gist?.owner === session?.user?.id;

  // you must be owner OR the gist must be visible
  if (gist === undefined || (!owns && !gist.visible)) return notFound();

  const highlighter = await getHighlighter({
    theme: "css-variables",
    langs: ["typescript", "python"],
  });

  const html = highlighter.codeToHtml(sanitize(gist.text), {
    theme: "css-variables",
  });

  return (
    <Provider gist={gist} html={html} session={session}>
      <NewGistPopup />
      <div className="px-4">{children}</div>
    </Provider>
  );
}
