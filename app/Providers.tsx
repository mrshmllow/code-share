"use client";

import { LazyMotion, domMax } from "framer-motion";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <LazyMotion features={domMax}>{children}</LazyMotion>;
}
