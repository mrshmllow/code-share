"use client";

import { useEffect, useState, useTransition } from "react";
import { Balancer } from "react-wrap-balancer";
import { createGist } from "./actions";
import { signIn, useSession } from "next-auth/react";
import NewGistPage from "./(default)/new/page";

const useKeyboardHandler = (
  handler: (this: HTMLElement, ev: KeyboardEvent) => any
) => {
  useEffect(() => {
    document.body.addEventListener("keydown", handler);

    return () => {
      document.body.removeEventListener("keydown", handler);
    };
  }, [handler]);
};

export default function Home() {
  const [permissionPending, setLoading] = useState(false);
  const [permError, setPermError] = useState(false);
  const [permanantDisable] = useState(false);
  const [gistCreatePending, startTransition] = useTransition();
  const session = useSession();

  async function createGistFromClipboard() {
    setLoading(true);
    if (session.status === "unauthenticated") {
      return signIn();
    }

    try {
      let text = await navigator.clipboard.readText();

      startTransition(() => createGist(text));
    } catch (e) {
      setPermError(true);
    } finally {
      setLoading(false);
    }
  }

  useKeyboardHandler(async (ev) => {
    if (!(ev.key === "v" && ev.ctrlKey)) {
      return;
    }

    await createGistFromClipboard();
  });

  return (
    <main className="relative">
      {/*<div className="pattern-wavy pattern-slate-800 pattern-bg-white pattern-size-8 pattern-opacity-20 absolute -top-24 left-0 w-full h-[calc(100%+6rem)] -z-10" />*/}

      <div className="px-4 pb-10 flex flex-col sm:items-center">
        <Balancer
          as="h1"
          className="text-4xl sm:text-6xl lg:text-7xl text-center my-8 sm:my-12 font-bold tracking-tight mx-auto"
        >
          Easily Share Code
        </Balancer>

        <NewGistPage />
      </div>
    </main>
  );
}
