import type { BaseHit, Hit } from "instantsearch.js";
import Link from "next/link";
import { Highlight, Snippet } from "react-instantsearch-hooks-web";

export default function GistHit({ hit }: { hit: Hit<BaseHit> }) {
  return (
    <Link
      className="rounded-lg border border-gray-300 mt-5 flex flex-col overflow-clip"
      href={`/${hit.owner}/${hit.objectID}`}
    >
      {hit["text"] ? (
        <pre className="border-b p-4 flex flex-col break-all whitespace-pre-wrap max-h-40 gradient-mask-b-80">
          <code className="">
            <Snippet hit={hit} attribute={"text"}></Snippet>
          </code>
        </pre>
      ) : null}

      <div className="px-4 py-2 bg-gray-100 flex justify-between">
        <h2 className="font-mono">
          {!hit["name"] ? (
            <em>Untitled Gist</em>
          ) : (
            <Highlight attribute={"name"} hit={hit} />
          )}
        </h2>

        {hit["language"] !== null && hit["language"] !== undefined && (
          <p>{String(hit["language"])}</p>
        )}
      </div>
    </Link>
  );
}
