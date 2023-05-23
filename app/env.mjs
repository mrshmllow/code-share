import { createEnv } from "@t3-oss/env-nextjs";
import { string } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: string().url(),
    OPENAI_API_KEY: string(),
    QSTASH_TOKEN: string(),
    QSTASH_CURRENT_SIGNING_KEY: string(),
    QSTASH_NEXT_SIGNING_KEY: string(),
    VERCEL_ENV: string().optional(),
  },
  client: {
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    VERCEL_ENV: process.env.VERCEL_ENV
  },
});
