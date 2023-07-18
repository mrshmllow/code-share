import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export default {
  schema: "./db/schema.ts",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  driver: "pg",
  out: "./drizzle",
} satisfies Config;
