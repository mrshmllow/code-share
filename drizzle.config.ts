import type { Config } from "drizzle-kit";
 
export default {
  schema: "./db/schema.ts",
  connectionString: process.env.DATABASE_URL,
  out: "./drizzle"
} satisfies Config;
