"use client";

import { LazyMotion } from "framer-motion";
import { ReactNode } from "react";
import { PusherProvider } from "@harelpls/use-pusher";
import { env } from "./env.mjs";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import SearchProvider from "./SearchProvider";
import Palette from "./Palette";

const loadFeatures = () =>
  import("../lib/motionFeatures").then((res) => res.default);

const config = {
  clientKey: env.NEXT_PUBLIC_PUSHER_KEY,
  cluster: "us3",
};

export default function ClientProviders({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <LazyMotion features={loadFeatures} strict>
        <SearchProvider>
          <PusherProvider {...config}>
            <Palette />

            {children}
          </PusherProvider>
        </SearchProvider>
      </LazyMotion>
    </SessionProvider>
  );
}
