import { NameContent } from "@/app/design/NameContent";
import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { eq } from "drizzle-orm";
import hljs from "highlight.js";
import { sanitize } from "isomorphic-dompurify";
import { notFound } from "next/navigation";

export default async function GistIframePage({
  params: { gist_id },
}: {
  params: {
    gist_id: string;
  };
}) {
  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, gist_id),
  });

  if (gist === undefined || !gist.visible) return notFound();

  const highlight = hljs.highlightAuto(
    gist.text,
    gist.language ? [gist.language] : undefined
  );

  const language = highlight.language ? highlight.language : gist.language;

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
              __html: sanitize(highlight.value),
            }}
          ></code>
        </pre>
      </div>

      <div className="border-t border-gray-300 bg-gray-100 p-2 flex justify-end">
        <>{language && <p>{language}</p>}</>
      </div>
    </div>
  );
}
