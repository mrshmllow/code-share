import { InferModel } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const gists = pgTable("gists", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  text: text("text").notNull(),
  aiNameReason: text("ai_name_reason"),
});

export type Gist = InferModel<typeof gists>;

