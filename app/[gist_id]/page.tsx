"use client";

import Spinner from "../design/icons/Spinner";
import { useContext } from "react";
import { GistContext } from "./store";

export default function GistPage() {
  const { gist, html } = useContext(GistContext);

  return (
    <div>
      <div className="border border-slate-700 rounded-lg p-2">
        <button className="inline-flex hover:bg-slate-900 gap-4 px-4 py-2 rounded-lg shrink items-center text-slate-300 hover:text-white font-mono">
          {!gist.name ? (
            <>
              <span>~/generting gist name</span>

              <span className="w-5 h-5">
                <Spinner />
              </span>
            </>
          ) : (
            <span>{gist.name}</span>
          )}
        </button>

        <div
          dangerouslySetInnerHTML={{
            __html: html,
          }}
          className="[&>pre]:overflow-x-auto"
        ></div>
      </div>
    </div>
  );
}
