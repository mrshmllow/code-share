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

  async function createGistFromClipboard() {
    if (!(await hasClipboardReadPermission())) {
      return setPermError(true);
    }

    try {
      const text = await navigator.clipboard.readText();

      startTransition(() => createGist(text));
    } catch (e) {
      setPermError(true);
    }
  }

  useKeyboardHandler(async (ev) => {
    if (!(ev.key === "v" && ev.ctrlKey)) {
      return;
    }

    setLoading(true);
    await createGistFromClipboard();
    setLoading(false);
  });

  return (
    <main className="relative">
      <div className="pattern-wavy pattern-slate-800 pattern-bg-white pattern-size-8 pattern-opacity-20 absolute -top-24 left-0 w-full h-[calc(100%+6rem)] -z-10" />

      <div className="px-4 pb-10 flex flex-col items-center">
        <Balancer
          as="h1"
          className="text-4xl sm:text-5xl lg:text-6xl my-5 mb-7"
        >
          Easily Share Code
        </Balancer>

        <div className="flex items-center gap-3 flex-wrap mb-2">
          <ButtonishLink href="/new">New Gist</ButtonishLink>

          <Button
            onClick={async () => {
              setLoading(true);
              await createGistFromClipboard();
              setLoading(false);
            }}
            isBusy={permissionPending || gistCreatePending}
            disabled={permanantDisable}
          >
            <Button.Icon>
              {permError ? <ExclamationCircleIcon /> : <ClipboardIcon />}
            </Button.Icon>

            <Button.Text>From Clipboard</Button.Text>
          </Button>
        </div>

        <p className="text-slate-200 select-none hidden sm:block">
          Try hitting <strong>ctrl+v</strong>!
        </p>
      </div>
    </main>
  );
}
