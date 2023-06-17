import { env } from "@/app/env.mjs";
import NextAuth, { AuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
