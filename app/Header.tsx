"use client";

import Link from "next/link";
import Button from "./design/button/Button";
import { Menu } from "@headlessui/react";
import { cx } from "cva";
import {
  ClipboardIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { hasClipboardReadPermission } from "./clipboard";

export default function Header() {
  const [permError, setPermError] = useState(false);

  async function localIsPermissionDenied() {
    const has = await hasClipboardReadPermission();

    if (has) {
      setPermError(true);
    }

    return has;
  }

  useEffect(() => {
    localIsPermissionDenied();
  }, []);

  return (
    <nav className="px-4 py-2 flex justify-between">
      <Link href="/" className="text-lg font-bold sm:text-xl inline-flex items-center">
        Snippet Share
      </Link>

      <div className="flex items-center text-gray-800 gap-4">
        <p className="font-normal select-none hidden sm:block">
          ctrl+v
        </p>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button as={Button}>New Snippet</Menu.Button>
          </div>
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col z-10 p-2">
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={cx(
                    "px-4 py-2 rounded-lg text-left",
                    active && "bg-gray-200"
                  )}
                  href="/new"
                >
                  New Snippet
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={cx(
                    "px-4 py-2 rounded-lg text-left flex items-center gap-2 disabled:text-gray-600",
                    active && "bg-gray-200"
                  )}
                  onClick={async () => {
                    if (await localIsPermissionDenied()) {
                    }

                    try {
                      const text = await navigator.clipboard.readText();

                      console.log(text);
                    } catch { }
                  }}
                  disabled={permError}
                >
                  <span className="w-5 h-5">
                    {permError ? <ExclamationCircleIcon /> : <ClipboardIcon />}
                  </span>

                  <span>From Clipboard</span>
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </nav>
  );
}
