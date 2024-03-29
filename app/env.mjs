import { createEnv } from "@t3-oss/env-nextjs";
import { string } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: string().url(),
    OPENAI_API_KEY: string(),
    QSTASH_TOKEN: string(),
    QSTASH_CURRENT_SIGNING_KEY: string(),
    QSTASH_NEXT_SIGNING_KEY: string(),
    PUSHER_SECRET: string(),
    GITHUB_SECRET: string(),
    NEXTAUTH_SECRET: string(),
    NEXTAUTH_URL: string().url(),
    ALGOLIA_KEY: string(),
  },
  client: {
    NEXT_PUBLIC_PUSHER_KEY: string(),
    NEXT_PUBLIC_PUSHER_ID: string(),
    NEXT_PUBLIC_GITHUB_ID: string(),
    NEXT_PUBLIC_ALGOLIA_ID: string(),
    NEXT_PUBLIC_ALGOLIA_KEY: string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_PUSHER_ID: process.env.NEXT_PUBLIC_PUSHER_ID,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    NEXT_PUBLIC_GITHUB_ID: process.env.NEXT_PUBLIC_GITHUB_ID,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ALGOLIA_KEY: process.env.ALGOLIA_KEY,
    NEXT_PUBLIC_ALGOLIA_ID: process.env.NEXT_PUBLIC_ALGOLIA_ID,
    NEXT_PUBLIC_ALGOLIA_KEY: process.env.NEXT_PUBLIC_ALGOLIA_KEY,
  },
});
