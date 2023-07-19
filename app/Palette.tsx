"use client";

import { Combobox, Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Configure,
  useHits,
  useSearchBox,
} from "react-instantsearch-hooks-web";
import { useEventListener } from "usehooks-ts";
import hljs from "highlight.js";
import { usePaletteStore } from "./palette/store";

type Base = {
  label: string;
  id: string;
  icon?: ReturnType<typeof CheckIcon>;
  action?: boolean;
};

type ActionItem = {
  onActivate: () => Promise<void>;
  type: "choice";
} & Base;

type LinkItem = {
  href: string;
  type: "link" | "search";
} & Base;

type Catagory = {
  type: "catagory";
  inner: Item[];
} & Base;

type Item = LinkItem | ActionItem | Catagory;

export default function Palette() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setOpen] = useState(false);
  const session = useSession();
  const hits = useHits();
  const search = useSearchBox();
  const inputRef = useRef<HTMLInputElement>(null);
  const [catagoryPath, setCatagoryPath] = useState<string[]>([]);
  const { currentCapabilities, setPromptCallback, onLanguagePick } =
    usePaletteStore();

  useEffect(() => {
    setPromptCallback((id) => {
      setCatagoryPath([id]);
      setOpen(true);
    });
  }, []);

  const items = useMemo<Item[]>(() => {
    let items: Item[] = [
      {
        label: "New Snippet",
        id: "new",
        icon: <SparklesIcon />,
        type: "link",
        href: "/new",
        action: true,
      },
    ];

    if (currentCapabilities.pickLang) {
      items.push({
        label: "Change Highlighting",
        id: "change_lang",
        icon: <SparklesIcon />,
        type: "catagory",
        action: true,
        inner: [
          ...hljs.listLanguages().map(
            (lang) =>
              ({
                label: lang,
                id: `change_lang/${lang}`,
                onActivate: async () => {
                  await onLanguagePick(lang);
                },
                type: "choice",
              } as const)
          ),
        ],
      });
    }

    if (session.status === "authenticated" && session.data.user) {
      items.push(
        {
          label: session.data.user.name ?? "Your Profile",
          id: "profile",
          href: `/${session.data.user.id}`,
          icon: <UserIcon />,
          type: "link",
        },
        {
          label: "Settings",
          id: "settings",
          href: "/settings",
          icon: <Cog6ToothIcon />,
          type: "link",
        }
      );
    }

    items = [
      ...items,
      ...hits.hits.map(
        (hit) =>
          ({
            label: (hit["name"] as string | undefined) ?? "Untitled Gist",
            id: hit.objectID,
            type: "search",
            href: `/${hit["owner"]}/${hit.objectID}`,
          } as const)
      ),
    ];

    return items;
  }, [session, hits, currentCapabilities]);

  useEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      setOpen(true);
    }
  });

  useEventListener(
    "keydown",
    (event) => {
      console.log("true");
      if (event.key === "Backspace" && query === "") {
        setCatagoryPath((catagoryPath) => {
          catagoryPath.pop();
          return catagoryPath;
        });
      }
    },
    inputRef
  );

  const filteredItems = useMemo(() => {
    let filteredItems = [...items];

    for (const path of catagoryPath) {
      const catagory = filteredItems.find(
        (item) => item.id === path && item.type === "catagory"
      );

      if (!catagory || catagory.type !== "catagory") {
        return [];
      }

      filteredItems = catagory.inner;
    }

    return query === ""
      ? filteredItems.filter((item) => !item.action)
      : filteredItems.filter((item) => {
          if (item.type === "search") {
            return !query.startsWith(">");
          }

          if (item.action) {
            if (!query.startsWith(">")) {
              return false;
            }

            return item.label
              .toLowerCase()
              .includes(query.toLowerCase().substring(1));
          }

          return item.label.toLowerCase().includes(query.toLowerCase());
        });
  }, [query, items, catagoryPath]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setOpen(false);
        }}
        open={isOpen}
      >
        <Configure hitsPerPage={5} />

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex pt-14 justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform rounded-2xl bg-white text-center align-middle shadow-xl transition-all">
                <div className="flex w-full flex-col">
                  <Combobox
                    onChange={async (item: Item) => {
                      if ("href" in item) {
                        router.push(item.href);
                        setOpen(false);
                      }

                      if (item.type === "catagory") {
                        setCatagoryPath((catagoryPath) => {
                          catagoryPath.push(item.id);
                          return catagoryPath;
                        });
                      }

                      if (item.type === "choice") {
                        await item.onActivate();
                        setOpen(false);
                        setCatagoryPath((catagoryPath) => {
                          catagoryPath.pop();
                          return catagoryPath;
                        });
                      }
                    }}
                    defaultValue={items[0]}
                  >
                    <div className="flex items-center gap-2 pl-5 border-b border-b-gray-100 p-4 flex-row">
                      <MagnifyingGlassIcon className="w-5 h-5 hidden md:block" />

                      <div className="flex w-full text-sm md:text-base flex-col md:flex-row gap-2 md:gap-0">
                        {catagoryPath.map((catagoryId) => (
                          <div className="flex items-center" key={catagoryId}>
                            <Dialog.Title as="h3">
                              {
                                items.find((item) => item.id === catagoryId)
                                  ?.label
                              }
                            </Dialog.Title>

                            <span
                              aria-hidden="true"
                              className="px-1 md:px-2 text-gray-500"
                            >
                              /
                            </span>
                          </div>
                        ))}

                        <Combobox.Input
                          onChange={(event) => {
                            setQuery(event.target.value);

                            if (!event.target.value.startsWith(">"))
                              search.refine(event.target.value);
                          }}
                          ref={inputRef}
                          autoFocus={true}
                          className="outline-none"
                          placeholder={
                            catagoryPath[catagoryPath.length - 1]
                              ? "Search for options"
                              : "Search or jump to"
                          }
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck={false}
                          aria-label="Command Pallete input"
                        />
                      </div>
                    </div>

                    {query.length <= 0 && catagoryPath.length === 0 && (
                      <div className="text-sm p-2 pl-5 pb-0 text-left">
                        <p>
                          <strong>Tip: </strong>
                          Type {">"} to run commands
                        </p>
                      </div>
                    )}

                    <Combobox.Options className="max-h-80 rounded-b-2xl overflow-auto p-2 z-10 bg-white w-full">
                      {filteredItems.length === 0 && query !== "" ? (
                        <p className="rounded-lg py-2 pl-10 pr-4 text-left">
                          Nothing Found
                        </p>
                      ) : (
                        filteredItems.map((item) => (
                          <Combobox.Option
                            key={item.id}
                            value={item}
                            className={({ active }) =>
                              `relative flex justify-between cursor-default rounded-lg select-none py-2 pl-10 pr-4 text-left ${
                                active ? "bg-gray-100" : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    active ? "font-bold" : "font-normal"
                                  }`}
                                >
                                  {item.label}
                                </span>

                                {item.icon ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400`}
                                    aria-hidden="true"
                                  >
                                    <span className="h-5 w-5">{item.icon}</span>
                                  </span>
                                ) : null}

                                {active && (
                                  <span className="text-gray-600">
                                    {item.action
                                      ? "Run Command"
                                      : item.type === "choice"
                                      ? "Choose"
                                      : "Jump To"}
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Combobox>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
