"use client";

import { useEffect, useState, useTransition } from "react";
import Button from "./design/button/Button";
import {
  ClipboardIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { hasClipboardReadPermission } from "./clipboard";
import ButtonishLink from "./design/button/ButtonishLink";
import { Balancer } from "react-wrap-balancer";
import { createGist } from "./actions";
import { signIn, useSession } from "next-auth/react";

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

        <div className="flex items-center gap-3 flex-wrap mb-2">
          <ButtonishLink
            href="/new"
            className="w-full sm:w-fit"
            intent="secondary"
          >
            New Snippet
          </ButtonishLink>

          <Button
            onClick={async () => {
              await createGistFromClipboard();
            }}
            isBusy={permissionPending || gistCreatePending}
            disabled={permanantDisable}
            className="w-full sm:w-fit"
          >
            <Button.Icon>
              {permError ? <ExclamationCircleIcon /> : <ClipboardIcon />}
            </Button.Icon>

            <Button.Text>From Clipboard</Button.Text>
          </Button>
        </div>

        <p className="text-gray-800 select-none hidden sm:block">
          Try hitting <strong>ctrl+v</strong>!
        </p>
      </div>
    </main>
  );
}
