import { cookies, headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

// https://github.com/nextauthjs/next-auth/issues/7523#issuecomment-1594416675
// TODO: Remove in the future
export const getServerActionSession = () => {
  const req = {
    headers: Object.fromEntries(headers()),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map(c => [c.name, c.value]),
    ),
  } as any;
  const res = {
    getHeader() {
      /* empty */
    },
    setCookie() {
      /* empty */
    },
    setHeader() {
      /* empty */
    },
  } as any;
  return getServerSession(req, res, authOptions);
}

