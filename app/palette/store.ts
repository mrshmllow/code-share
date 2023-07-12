"use client";

import { useEffect } from "react";
import { create } from "zustand";

type Capabilities = {
  pickLang: boolean;
};

type PaletteState = {
  currentCapabilities: Capabilities;
  registerCapabilities: (capabilities: Capabilities) => void;
  clearCapabilities: () => void;
  registerOnLanguagePick: (callback: (lang: string) => Promise<void>) => void;
  clearOnLanguagePick: () => void;
  onLanguagePick: (language: string) => Promise<void>;

  prompt: (id: string) => void;
  setPromptCallback: (prompt: (id: string) => void) => void;
};

const defaultCapabilities: Capabilities = {
  pickLang: false,
};

export const usePaletteStore = create<PaletteState>((set) => ({
  currentCapabilities: defaultCapabilities,
  onLanguagePick: async () => {},
  registerCapabilities: (capabilities) => {
    set((state) => ({
      ...state,
      currentCapabilities: capabilities,
    }));
  },
  clearCapabilities: () => {
    set((state) => ({
      ...state,
      currentCapabilities: defaultCapabilities,
    }));
  },
  registerOnLanguagePick: (callback) => {
    set((state) => ({
      ...state,
      onLanguagePick: callback,
    }));
  },
  clearOnLanguagePick: () => {
    set((state) => ({
      ...state,
      onLanguagePick: async () => {},
    }));
  },

  prompt: () => {},

  setPromptCallback: (prompt) => {
    set((state) => ({
      ...state,
      prompt,
    }));
  },
}));

export const useRouteCapabilities = (capabilities: Capabilities) => {
  const { registerCapabilities, clearCapabilities } = usePaletteStore();

  useEffect(() => {
    registerCapabilities(capabilities);

    return () => {
      clearCapabilities();
    };
  }, []);
};

export const useOnLanguageChange = (
  callback: (language: string) => Promise<void>
) => {
  const { registerOnLanguagePick, clearOnLanguagePick } = usePaletteStore();

  useEffect(() => {
    registerOnLanguagePick(callback);

    return () => {
      clearOnLanguagePick();
    };
  }, []);
};
