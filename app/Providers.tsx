"use client";

import { LazyMotion } from "framer-motion";
import { ReactNode } from "react";

const loadFeatures = () =>
  import("../lib/motionFeatures").then((res) => res.default);

export default function Providers({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>;
}
