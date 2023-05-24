import { env } from "@/app/env.mjs";
import { Client } from "@upstash/qstash"

export const qstash = new Client({
  token: env.QSTASH_TOKEN,
});
