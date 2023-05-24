"use server";

import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Spinner from "../design/icons/Spinner";

export default async function GistPage({
  params: { gist_id },
}: {
  params: {
    gist_id: string;
  };
}) {
  const nameFetch = await fetch(`http://gist-share-production.up.railway.app/api/${gist_id}/name`);
  const { name } = (await nameFetch.json()) as {
    name: string | null;
  };

  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, Number(gist_id)),
  });

  if (gist === undefined || !nameFetch.ok) return notFound();

  return (
    <div>
      <em className="mb-3">Beta gist-view page</em>

      {name === null ? (
        <>
          <p className="flex items-center gap-3">
            <span className="w-3 h-3">
              <Spinner />
            </span>
            Generating a Name...
          </p>
        </>
      ) : (
        <p>{name}</p>
      )}

      <div className="border border-slate-700 p-4 rounded-lg">{gist.text}</div>
    </div>
  );
}
