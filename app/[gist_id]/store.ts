"use client";

import { Gist } from "@/db/schema";
import { createContext } from "react";

type Context = {
  gist: Gist;
  html: string,
  isOwner: boolean,
  language: string | null;
  updateName: (obj: { name: string; aiNameReason: string | null; aiCompleted: boolean }) => void;
};

// lets just save some time here
export const GistContext = createContext<Context>({} as Context);
