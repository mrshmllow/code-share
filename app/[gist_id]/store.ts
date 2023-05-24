"use client"

import { Gist } from "@/db/schema";
import { createContext } from "react";

export const GistContext = createContext<Gist | null>(null)
