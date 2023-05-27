import { InferModel, relations } from "drizzle-orm";
import {
  pgTable,
  boolean,
  text,
  primaryKey,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const gists = pgTable("gists", {
  id: text("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  text: text("text").notNull(),
  aiNameReason: text("ai_name_reason"),
  visible: boolean("visible").default(false).notNull(),
  owner: text("owner").notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export const usersRelations = relations(users, ({ many }) => ({
  providers: many(providers),
}));

const providerType = pgEnum("providerType", ["github"]);

export const providers = pgTable(
  "providers",
  {
    userId: uuid("user_id").notNull(),
    type: providerType("type").notNull(),
    accessToken: text("access_token").notNull(),
    scope: text("scope").notNull(),
    tokenType: text("token_type").notNull(),
  },
  (table) => ({
    idUserIdPk: primaryKey(table.type, table.userId),
  })
);

export const providersRelations = relations(providers, ({ one }) => ({
  user: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
}));

export type Gist = InferModel<typeof gists>;
