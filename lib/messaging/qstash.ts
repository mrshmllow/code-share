import { env } from "@/app/env.mjs";
import { Client } from "@upstash/qstash"

const qstash = new Client({
  token: env.QSTASH_TOKEN,
});

export default qstash;
