"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "./design/button/Button";
import { Menu } from "@headlessui/react";
import { cx } from "cva";
import {
  ChevronDownIcon,
  ClipboardIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState, useTransition } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { createGist } from "./actions";
import Spinner from "./design/icons/Spinner";
import TextInput from "./design/form/TextInput";
import ButtonIcon from "./design/button/ButtonIcon";

function CreateGistGroup() {
  const session = useSession();
  const [isLoading, startTransition] = useTransition();
  const [permError, setPermError] = useState(false);

  return (
    <>
      <Menu.Item>
        {({ active }) => (
          <Link
            className={cx(
              "px-4 py-2 rounded-lg text-left block",
              active && "bg-gray-100"
            )}
            href="/new"
          >
            New Snippet
          </Link>
        )}
      </Menu.Item>
      <Menu.Item disabled={permError}>
        {({ active }) => (
          <button
            className={cx(
              "px-4 py-2 rounded-lg text-left flex items-center gap-2 disabled:text-gray-600 w-full",
              active && "bg-gray-100"
            )}
            onClick={async (e) => {
              e.preventDefault();

              if (session.status === "unauthenticated") {
                return signIn();
              }

              try {
                let text = await navigator.clipboard.readText();

                startTransition(() => createGist(text));
              } catch (e) {
                setPermError(true);
              }
            }}
            disabled={permError}
          >
            <span className="w-5 h-5">
              {permError ? (
                <ExclamationCircleIcon />
              ) : isLoading ? (
                <Spinner />
              ) : (
                <ClipboardIcon />
              )}
            </span>

            <span>From Clipboard</span>
          </button>
        )}
      </Menu.Item>
    </>
  );
}

export default function Header() {
  const session = useSession();

  return (
    <nav className="px-4 py-2 flex justify-between">
      <Link
        href="/"
        className="text-lg font-bold sm:text-xl inline-flex items-center"
      >
        Snippet Share
      </Link>

      <form className="hidden sm:flex gap-2 w-2/4" action="/search">
        <TextInput
          className="w-full"
          placeholder="Search"
          autoCapitalize="none"
          autoComplete="off"
          name="search"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Search"
        />

        <Button type="submit" intent="secondary">
          <ButtonIcon>
            <MagnifyingGlassIcon className="w-6 h-6" />
          </ButtonIcon>
        </Button>
      </form>

      <div className="flex items-center gap-2">
        <Link
          href="/search"
          aria-label="Search Snippets"
          className="hover:bg-gray-100 rounded-lg text-black px-2 min-h-[2.5rem] inline-flex items-center justify-center outline-none ring-offset-white focus-visible:ring-2 ring-offset-2 ring-indigo-500/50 sm:hidden"
        >
          <MagnifyingGlassIcon className="w-6 h-6" />
        </Link>

        {session.status === "unauthenticated" ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button as={Button}>New Snippet</Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-200 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col z-10">
              <div className="px-2 py-2">
                <CreateGistGroup />
              </div>
              <div className="px-2 py-2">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={cx(
                        "px-4 py-2 rounded-lg text-left block",
                        active && "bg-gray-100"
                      )}
                      href="/sign-in"
                    >
                      Sign In
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        ) : (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="relative min-h-[2.5rem] inline-flex flex-row items-center gap-3">
              <Image
                src={session.data?.user?.image ?? "unknown"}
                className="rounded-full"
                alt={session.data?.user?.email ?? "unknown"}
                width={30}
                height={30}
              />

              <ChevronDownIcon className="w-5 h-5" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-200 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col z-10">
              <div className="px-2 py-2">
                <CreateGistGroup session={session} />
              </div>
              <div className="px-2 py-2">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={cx(
                        "px-4 py-2 rounded-lg text-left block",
                        active && "bg-gray-100"
                      )}
                      href={`/${session?.data?.user?.id}`}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={cx(
                        "px-4 py-2 rounded-lg text-left block",
                        active && "bg-gray-100"
                      )}
                      href="/settings"
                    >
                      Account Settings
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="p-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cx(
                        "px-4 py-2 rounded-lg text-left block w-full text-red-500",
                        active && "bg-gray-100"
                      )}
                      onClick={async (e) => {
                        e.preventDefault();
                        await signOut({
                          redirect: true,
                        });
                      }}
                    >
                      Log Out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        )}
      </div>
    </nav>
  );
}
