"use client";

import Spinner from "../design/icons/Spinner";
import { useContext } from "react";
import { GistContext } from "./store";

export default function GistPage() {
  const { gist } = useContext(GistContext);

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
