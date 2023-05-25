"use client";

import Spinner from "../design/icons/Spinner";
import { useContext } from "react";
import { GistContext } from "./store";
import { useChannel, useEvent } from "@harelpls/use-pusher";

export default function GistPage({
  params: { gist_id },
}: {
  params: {
    gist_id: string;
  };
}) {
  const { gist, updateName } = useContext(GistContext);
  const channel = useChannel(`gist-update.${gist_id}`);

  !gist.name &&
    useEvent<{ name: string; aiNameReason: string }>(
      channel,
      "name",
      (data) => data && updateName(data)
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

      <div className="border border-slate-700 p-4 rounded-lg flex flex-col">
        {gist?.text.split("\n").map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </div>
    </div>
  );
}
