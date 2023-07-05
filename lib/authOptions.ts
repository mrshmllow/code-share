import { env } from "@/app/env.mjs";
import SnippetsDrizzleAdapter from "@/db/adapter";
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  adapter: SnippetsDrizzleAdapter(null, {}),
  callbacks: {
    session({ session, token, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
    // async jwt({ token }) {
    //   return token
    // }
  },
  pages: {
    signIn: "/sign-in",
    // error: "/",
    newUser: "/new",
    signOut: "/sign-out",
    // verifyRequest: "/"
  },
};
