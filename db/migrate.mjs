import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../app/env.mjs";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });

export default function () {
  migrate(drizzle(migrationClient), {
    migrationsFolder: "./drizzle",
  }).then(() => console.log("Migrations complete!"));
}
