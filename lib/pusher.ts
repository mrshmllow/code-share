import { env } from "@/app/env.mjs";
import Pusher from "pusher";

export const pusher = new Pusher({
  appId: env.NEXT_PUBLIC_PUSHER_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: "us3",
  useTLS: true,
});
