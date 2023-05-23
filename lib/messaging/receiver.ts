import { env } from "@/app/env.mjs";
import { Receiver } from "@upstash/qstash/nodejs";

export const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

