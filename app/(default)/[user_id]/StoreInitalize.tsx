"use client";

import { useRef } from "react";
import { StoreApi, UseBoundStore } from "zustand";

export default function StoreInitalizer<T>({
  state,
  store,
}: {
  state: T | Partial<T> | ((state: T) => T | Partial<T>);
  store: UseBoundStore<StoreApi<T>>;
}) {
  const initalized = useRef(false);

  if (!initalized.current) {
    store.setState(state);
    initalized.current = true;
  }

  return null;
}
