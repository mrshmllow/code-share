import { Adapter } from "next-auth/adapters";
import { db } from "./db";
import { accounts, sessions, users, verificationTokens } from "./schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid/async";

export default function SnippetsDrizzleAdapter(
  client: any,
  options = {}
): Adapter {
  return {
    async createUser(user) {
      const dbUser = await db
        .insert(users)
        .values({
          ...user,
          id: await nanoid(),
        })
        .returning({
          id: users.id,
          email: users.email,
          emailVerified: users.emailVerified,
        });

      // TODO: No !
      return dbUser[0]!;
    },
    async getUser(id) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, id)
      })

      return dbUser ?? null;
    },
    async getUserByEmail(email) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, email)
      })

      return dbUser ?? null;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const dbUser = await db.query.accounts.findFirst({
        with: {
          user: {
            columns: {
              id: true,
              email: true,
              emailVerified: true,
            },
          },
        },
        columns: {},
        where: and(
          eq(accounts.providerAccountId, providerAccountId),
          eq(accounts.provider, provider)
        ),
      });

      return dbUser?.user ?? null;
    },
    async updateUser(user) {
      const dbUser = await db
        .update(users)
        .set(user)
        .where(eq(users.id, user.id))
        .returning();

      // TODO: no !
      return dbUser[0]!;
    },
    async deleteUser(userId) {
      await db.delete(users).where(eq(users.id, userId));
    },
    async linkAccount(account) {
      await db.insert(accounts).values(account)

      return account;
    },
    async createSession(session) {
      const dbSession = await db
        .insert(sessions)
        .values({
          ...session,
          id: await nanoid(),
        })
        .returning();

      // TODO: no !
      return dbSession[0]!;
    },
    async getSessionAndUser(sessionToken) {
      const sessionAndUser = await db.query.sessions.findFirst({
        with: {
          user: true,
        },
        where: eq(sessions.sessionToken, sessionToken),
      });

      if (!sessionAndUser) return null;

      const { user, ...session } = sessionAndUser;
      return { user, session };
    },
    async updateSession(session) {
      const updatedSession = await db
        .update(sessions)
        .set(session)
        .where(eq(sessions.sessionToken, session.sessionToken))
        .returning();

      return updatedSession[0];
    },
    async deleteSession(sessionToken) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },
    async createVerificationToken(verificationToken) {
      const dbVerificationToken = await db
        .insert(verificationTokens)
        .values(verificationToken)
        .returning();

      return dbVerificationToken[0];
    },
    async useVerificationToken({ identifier, token }) {
      const verificationToken = await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, identifier),
            eq(verificationTokens.token, token)
          )
        )
        .returning();

      return verificationToken[0] ?? null;
    },
  };
}
