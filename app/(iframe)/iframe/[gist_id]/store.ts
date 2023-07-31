"use client";

import { Gist } from "@/db/schema";
import { create } from "zustand";

type IFrameGistState = {
  html: string;
} & Gist;

export const useiFrameStore = create<IFrameGistState>((set) => ({
  name: "",
  aiCompleted: false,
  aiNameReason: "",
  aiTags: "",
  description: "",
  id: "",
  language: "",
  owner: "",
  text: "",
  visible: false,
  html: "",
}));
