import { db } from "@/db/db";
import { providers, users } from "@/db/schema";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const cookieJar = cookies();

  const code = params.get("code");
  const state = params.get("state");
  const savedState = cookieJar.get("github_oauth_state")?.value;

  if (!code || !state) {
    return new Response("Missing code or state", { status: 400 });
  }

  cookieJar.get("github_oauth_state");

  if (!savedState || state !== savedState)
    return new Response("Invalid state", { status: 400 });

  const url = new URL("https://github.com/login/oauth/access_token");

  url.searchParams.set("client_id", "f6eb7fa363e1dca1e7d5");
  url.searchParams.set(
    "client_secret",
    "3698fd1cc113e363f28ff704c78bf0beb261107b"
  );
  url.searchParams.set("code", code);
  url.searchParams.set(
    "redirect_uri",
    "https://gist-share-production.up.railway.app/api/login/callback"
  );

  const response = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
    },
  });

  const data = (await response.json()) as {
    access_token: string;
    scope: string;
    token_type: string;
  };

  const user = await db
    .insert(users)
    .values({})
    .onConflictDoNothing()
    .returning();

  const provider = await db
    .insert(providers)
    .values({
      tokenType: data.token_type,
      accessToken: data.access_token,
      scope: data.scope,
      type: "github",
      userId: user[0].id,
    })
    .onConflictDoUpdate({
      target: [providers.userId, providers.type],
      set: {
        accessToken: data.access_token,
        scope: data.scope,
        tokenType: data.token_type,
      },
    })
    .returning();
}
