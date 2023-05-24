"use client";

import { useEffect, useState, useTransition } from "react";
import Button from "./design/button/Button";
import {
  ClipboardIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { isPermissionDenied } from "./clipboard";
import ButtonishLink from "./design/button/ButtonishLink";
import { Balancer } from "react-wrap-balancer";
import { createGist } from "./actions";

export default function Home() {
  const [permissionPending, setLoading] = useState(false);
  const [permError, setPermError] = useState(false);
  const [permanantDisable, setPermanantDisable] = useState(false);
  const [gistCreatePending, startTransition] = useTransition();

  async function localIsPermissionDenied() {
    const has = await isPermissionDenied();

    if (has) {
      setPermError(true);
    }

    return has;
  }

  function showPermError() {
    setPermError(true);

    console.log("perm error");
  }

  async function createGistFromClipboard() {
    const text = await navigator.clipboard.readText();

    startTransition(() => createGist(text));
  }

  useEffect(() => {
    localIsPermissionDenied();
    // setPermanantDisable(true);

    async function handleKeyDown(ev: KeyboardEvent) {
      if (!(ev.key === "v" && ev.ctrlKey)) {
        return;
      }

      if (await localIsPermissionDenied()) {
        return showPermError();
      }

      setLoading(true);

      try {
        await createGistFromClipboard();
      } catch {
        showPermError();
      }

      setLoading(false);
    }

    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

        <div className="flex items-center gap-3 flex-wrap">
          <ButtonishLink href="/new">
            New Gist
          </ButtonishLink>

          <Button
            onClick={async () => {
              if (await localIsPermissionDenied()) {
                return showPermError();
              }

              setLoading(true);

              try {
                await createGistFromClipboard();
              } catch {
                showPermError();
              }

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

          <p className="text-slate-200 select-none hidden sm:block">
            Or ctrl+v
          </p>
        </div>
      </div>
    </main>
  );
}
