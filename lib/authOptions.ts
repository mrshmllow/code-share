import { env } from "@/app/env.mjs";
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token
    }
  },
  pages: {
    signIn: "/sign-in",
    // error: "/",
    // newUser: "/",
    // signOut: "/",
    // verifyRequest: "/"
  },
};

