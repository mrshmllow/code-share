"use server";

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { promisify } from "util";

const asyncRandomBytes = promisify(randomBytes);

export async function startGithubAuth() {
  const cookieJar = cookies();
  const url = new URL("https://github.com/login/oauth/authorize");
  const state = (await asyncRandomBytes(16)).toString("hex");

  cookieJar.set("github_oauth_state", state);

  url.searchParams.set("client_id", "f6eb7fa363e1dca1e7d5");
  url.searchParams.set(
    "redirect_uri",
    "https://gist-share-production.up.railway.app/api/login/callback"
  );
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set("state", state);

  redirect(url.toString());
}
