import { env } from "@/app/env.mjs";
import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: env.GITHUB_SECRET
    })
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
}

export default NextAuth(authOptions)
