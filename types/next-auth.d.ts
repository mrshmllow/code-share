import NextAuth, { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }
}
