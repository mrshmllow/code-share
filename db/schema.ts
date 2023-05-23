import { boolean, pgTable, serial, text } from "drizzle-orm/pg-core";

export const gists = pgTable("gists", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  text: text("text").notNull(),
  aiNameReason: boolean("ai_name_reason"),
});
