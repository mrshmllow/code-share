import { InferModel, relations } from "drizzle-orm";
import {
  pgTable,
  boolean,
  integer,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const gists = pgTable("gists", {
  id: text("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  text: text("text").notNull(),
  aiNameReason: text("ai_name_reason"),
  visible: boolean("visible").default(false).notNull(),
  aiCompleted: boolean("ai_completed").default(false).notNull(),
  aiTags: text("ai_tags"),
  owner: text("owner").notNull(),
  language: text("language"),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  // TODO: UNIQUE email
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expires: timestamp("expires").notNull(),
  // TODO: UNIQUE session_token
  sessionToken: text("session_token").notNull(),
  userId: text("user_id").notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id").notNull(),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),

    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => {
    return {
      pk: primaryKey(table.provider, table.providerAccountId),
    };
  }
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    // TODO: UNIQUE token
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.identifier, table.token),
    };
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  verificationTokens: many(verificationTokens),
  gists: many(gists),
}));

export const gistsRelations = relations(gists, ({ one }) => ({
  owner: one(users, {
    fields: [gists.owner],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export type Gist = InferModel<typeof gists>;

// TODO: Use views. Blocked.
export type Profile = Omit<InferModel<typeof users>, "emailVerified" | "email">;
