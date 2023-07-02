import { InferModel } from "drizzle-orm";
import {
  pgTable,
  boolean,
  text,
  uuid,
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
  owner: text("owner").notNull()
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export type Gist = InferModel<typeof gists>;
