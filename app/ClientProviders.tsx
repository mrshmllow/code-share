"use client";

import { LazyMotion } from "framer-motion";
import { ReactNode } from "react";
import { PusherProvider } from "@harelpls/use-pusher";
import { env } from "./env.mjs";

const loadFeatures = () =>
  import("../lib/motionFeatures").then((res) => res.default);

const config = {
  clientKey: env.NEXT_PUBLIC_PUSHER_KEY,
  cluster: "us3",
};

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <PusherProvider {...config}>{children}</PusherProvider>
    </LazyMotion>
  );
}
