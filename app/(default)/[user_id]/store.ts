"use client";

import { Profile } from "@/db/schema";
import { create } from "zustand";

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type ProfileState = {} & NonNullableFields<Profile>;

export const useProfileStore = create<ProfileState>(() => ({
  id: "",
  image: "",
  name: "",
}));
