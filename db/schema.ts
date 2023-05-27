import { InferModel } from "drizzle-orm";
import { pgTable, boolean, text } from "drizzle-orm/pg-core";

export const gists = pgTable("gists", {
  id: text("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  text: text("text").notNull(),
  aiNameReason: text("ai_name_reason"),
  visible: boolean("visible").default(false).notNull(),
});

export type Gist = InferModel<typeof gists>;
