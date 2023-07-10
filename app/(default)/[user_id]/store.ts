"use client";

import { Profile } from "@/db/schema";
import { create } from "zustand";

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type ProfileState = {
  // updateProfile: (profile: Profile) => void;
} & NonNullableFields<Profile>;

export const useProfileStore = create<ProfileState>((set) => ({
  id: "",
  image: "",
  name: "",
  // updateProfile: (profile) =>
  //   set((state) => ({
  //     ...state,
  //     ...profile,
  //   })),
}));
