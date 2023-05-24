"use client";

import { Gist } from "@/db/schema";
import { ReactNode } from "react";
import { GistContext } from "./store";

export function Provider({
  children,
  gist,
}: {
  children: ReactNode;
  gist: Gist;
}) {
  return <GistContext.Provider value={gist}>{children}</GistContext.Provider>;
}
