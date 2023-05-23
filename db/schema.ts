import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const gists = pgTable("gists", {
  id: serial("id").primaryKey(),
  name: text("name"),
  text: text("text").notNull()
})
