"use client";

import { NameContent } from "@/app/design/NameContent";
import ButtonishLink from "@/app/design/button/ButtonishLink";
import { useiFrameStore } from "./store";
import "@catppuccin/highlightjs/sass/catppuccin-latte.scss";

export default function GistIframePage() {
  const gist = useiFrameStore();

  return (
    <div className="border border-gray-300 rounded-lg">
      <div className="border-b border-gray-300 p-2 flex justify-between">
        <p className="inline-flex items-center gap-4 px-4 py-2 font-mono text-gray-700">
          <NameContent aiCompleted={gist.aiCompleted} name={gist.name} />
        </p>
      </div>

      <div className="flex flex-row p-2 overflow-auto">
        <pre className="flex flex-col font-mono px-4">
          {[...Array((gist.text.match(/\n/g) || "").length + 1)].map((_, i) => (
            <a href={`#L${i + 1}`} key={i} className="" id={`L${i + 1}`}>
              {i + 1}
            </a>
          ))}
        </pre>

        <pre className="overflow-x-auto break-all">
          <code
            dangerouslySetInnerHTML={{
              __html: gist.html,
            }}
          ></code>
        </pre>
      </div>

      <div className="border-t border-gray-300 bg-gray-100 p-2 flex justify-between items-center">
        <ButtonishLink
          href={`https://snip.cafe/${gist.owner}/${gist.id}`}
          target="_blank"
          intent="secondary"
          rel="noopener noreferrer"
        >
          View on snip.cafe
        </ButtonishLink>

        <>{gist.language && <p>{gist.language}</p>}</>
      </div>
    </div>
  );
}
