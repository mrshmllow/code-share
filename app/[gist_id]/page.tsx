"use client";

import Spinner from "../design/icons/Spinner";
import { useContext } from "react";
import { GistContext } from "./store";
import { useInterval } from "usehooks-ts";

export default function GistPage({
  params: { gist_id },
}: {
  params: {
    gist_id: string;
  };
}) {
  const { gist, updateName } = useContext(GistContext);

  useInterval(
    async () => {
      const res = await fetch(`/api/name/${gist_id}`, {
        next: {
          tags: [`${gist_id}.name`],
          revalidate: 10,
        },
      });

      if (!res.ok) {
        return;
      }

      updateName(await res.json());
    },
    gist.name ? null : 3000
  );

  return (
    <div>
      <em className="mb-3">Beta gist-view page</em>

      {!gist.name ? (
        <>
          <p className="flex items-center gap-3">
            <span className="w-3 h-3">
              <Spinner />
            </span>
            Generating a Name...
          </p>
        </>
      ) : (
        <p title={gist.aiNameReason ? gist.aiNameReason : undefined}>
          {gist.name}
        </p>
      )}

      <div className="border border-slate-700 p-4 rounded-lg">{gist?.text}</div>
    </div>
  );
}
