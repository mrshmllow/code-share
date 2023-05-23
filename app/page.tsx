"use client";

import { useEffect, useState } from "react";
import Button from "./design/button/Button";
import {
  ClipboardIcon,
  ExclamationCircleIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { isPermissionDenied } from "./clipboard";

export default function Home() {
  const [permissionPending, setLoading] = useState(false);
  const [permError, setPermError] = useState(false);
  const [permanantDisable, setPermanantDisable] = useState(false);

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

  useEffect(() => {
    localIsPermissionDenied();
    setPermanantDisable(true)

    async function handleKeyDown(ev: KeyboardEvent) {
      if (!(ev.key === "v" && ev.ctrlKey)) {
        return;
      }

      if (await localIsPermissionDenied()) {
        return showPermError();
      }

      setLoading(true);

      try {
        const text = await navigator.clipboard.readText();

        console.log(text);
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

      <div className="px-4 pb-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl my-5 mb-7">
          Easily Share Code
        </h1>

        <h2 className="text-lg mb-1">Share Gist</h2>

        <div className="flex items-center gap-3 flex-wrap">
          <Button>New Gist</Button>

          <Button
            onClick={async () => {
              if (await localIsPermissionDenied()) {
                return showPermError();
              }

              setLoading(true);

              try {
                const text = await navigator.clipboard.readText();

                console.log(text);
              } catch {
                showPermError();
              }

              setLoading(false);
            }}
            busy={permissionPending}
            disabled={permanantDisable}
          >
            <Button.Icon>
              {permError ? <ShieldExclamationIcon /> : <ClipboardIcon />}
            </Button.Icon>

            <Button.Text>From Clipboard</Button.Text>
          </Button>

          <p className="text-slate-200 select-none">Or ctrl+v</p>
        </div>
      </div>
    </main>
  );
}
