import { ImageResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gist_id = url.searchParams.get("gist_id");
  const snippet_name = url.searchParams.get("snippet_name");
  const snippet_content = url.searchParams.get("snippet_content");
  const snippet_lang = url.searchParams.get("snippet_lang");

  if (!gist_id || !snippet_content)
    return new Response("Incorrect request", {
      status: 400,
    });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          fontSize: 20,
        }}
      >
        <div tw="flex border-b border-gray-300 p-2 justify-between w-full">
          <p tw="inline-flex items-center gap-4 px-4 py-2 font-mono text-gray-700">
            {snippet_name !== null ? (
              <>{snippet_name}</>
            ) : (
              <em tw="italic">Untitled Snippet</em>
            )}
          </p>
        </div>

        <div tw="flex flex-row grow p-2 overflow-auto w-full">
          <pre tw="flex flex-col font-mono px-4">
            {[...Array((snippet_content.match(/\n/g) || "").length + 1)].map(
              (_, i) => (
                <a href={`#L${i + 1}`} key={i} className="" id={`L${i + 1}`}>
                  {i + 1}
                </a>
              )
            )}
          </pre>

          <pre tw="overflow-x-auto break-all">
            <code>{snippet_content}</code>
          </pre>
        </div>

        <div tw="border-t border-gray-300 bg-gray-100 p-2 flex justify-end w-full">
          <p>{snippet_lang}</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
