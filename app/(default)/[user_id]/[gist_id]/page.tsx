"use client";

import { useContext, useRef, useState } from "react";
import { GistContext } from "./store";
import TextInput from "@/app/design/form/TextInput";
import Button from "@/app/design/button/Button";
import { experimental_useOptimistic as useOptimistic } from "react";
import { updateLanguage, updateName } from "./actions";
import { ClipboardIcon, LinkIcon } from "@heroicons/react/24/outline";
import "@catppuccin/highlightjs/sass/catppuccin-latte.scss";
import {
  useRouteCapabilities as useRouteCapabilities,
  usePaletteStore,
  useOnLanguageChange,
} from "@/app/palette/store";
import { NameContent } from "@/app/design/NameContent";
import { Menu } from "@headlessui/react";
import { cx } from "cva";

export default function GistPage() {
  const { gist, language, isOwner, html } = useContext(GistContext);
  const [editing, setEditing] = useState<"name" | "lang" | null>(null);
  const [optimisticName, optimisticUpdateName] = useOptimistic<
    string | null,
    string | null
  >(gist.name, (_, name) => name);
  const text = useRef<HTMLInputElement>(null);
  const { prompt } = usePaletteStore();

  useRouteCapabilities({
    pickLang: isOwner,
  });

  useOnLanguageChange(async (language) => {
    await updateLanguage({
      id: gist.id,
      language,
    });
  });

  return (
    <>
      <div className="border border-gray-300 rounded-lg">
        <div className="border-b border-gray-300 p-2 flex justify-between">
          {editing !== "name" ? (
            <>
              <span aria-hidden="true" className="sr-only">
                {optimisticName}
              </span>

              {isOwner ? (
                <button
                  className="inline-flex font-mono hover:bg-gray-100 gap-4 px-4 py-2 rounded-lg shrink items-center text-gray-700"
                  aria-label="Edit snippet title"
                  onClick={() => {
                    setEditing("name");
                  }}
                >
                  <NameContent
                    aiCompleted={gist.aiCompleted}
                    name={optimisticName}
                  />
                </button>
              ) : (
                <p className="inline-flex items-center gap-4 px-4 py-2 font-mono text-gray-700">
                  <NameContent
                    aiCompleted={gist.aiCompleted}
                    name={optimisticName}
                  />
                </p>
              )}

              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button as={Button}>Share Snippet</Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-200 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col z-10">
                  <div className="px-2 py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={cx(
                            "px-4 py-2 rounded-lg text-left flex items-center gap-2 disabled:text-gray-600 w-full",
                            active && "bg-gray-100"
                          )}
                          onClick={async (e) => {
                            e.preventDefault();
                            await navigator.clipboard.writeText(gist.text);
                          }}
                        >
                          <span className="w-5 h-5">
                            <ClipboardIcon />
                          </span>

                          <span>Copy Text</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={cx(
                            "px-4 py-2 rounded-lg text-left flex items-center gap-2 disabled:text-gray-600 w-full",
                            active && "bg-gray-100"
                          )}
                          onClick={async (e) => {
                            e.preventDefault();
                            await navigator.clipboard.writeText(
                              `https://snip.cafe/${gist.owner}/${gist.id}`
                            );
                          }}
                        >
                          <span className="w-5 h-5">
                            <LinkIcon />
                          </span>

                          <span>Copy Link</span>
                        </button>
                      )}
                    </Menu.Item>
                  </div>

                  {navigator.share && (
                    <div className="px-2 py-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={cx(
                              "px-4 py-2 rounded-lg text-left flex items-center gap-2 disabled:text-gray-600 w-full",
                              active && "bg-gray-100"
                            )}
                            onClick={async (e) => {
                              e.preventDefault();
                              await navigator.share({
                                url: `https://snip.cafe/${gist.owner}/${gist.id}`,
                              });
                            }}
                          >
                            <span>Share Via...</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  )}
                </Menu.Items>
              </Menu>
            </>
          ) : (
            <form
              className="flex gap-2 w-full"
              onSubmit={async () => {
                if (text.current === null) return;

                optimisticUpdateName(text.current.value);
                setEditing(null);

                await updateName({
                  id: gist.id,
                  name: text.current.value,
                });
              }}
            >
              <TextInput
                className="font-mono"
                autoFocus
                placeholder="main.py"
                full
                ref={text}
                defaultValue={optimisticName ? optimisticName : ""}
              />

              <Button intent="primary" className="order-last" type="submit">
                <Button.Text>Save</Button.Text>
              </Button>

              <Button intent="secondary" onClick={() => setEditing(null)}>
                <Button.Text>Cancel</Button.Text>
              </Button>
            </form>
          )}
        </div>

        <div className="flex flex-row p-2 overflow-auto">
          <pre className="flex flex-col font-mono px-4">
            {[...Array((gist.text.match(/\n/g) || "").length + 1)].map(
              (_, i) => (
                <a href={`#L${i + 1}`} key={i} className="" id={`L${i + 1}`}>
                  {i + 1}
                </a>
              )
            )}
          </pre>

          <pre className="overflow-x-auto break-all">
            <code
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            ></code>
          </pre>
        </div>

        <div className="border-t border-gray-300 bg-gray-100 p-2 flex justify-end">
          {isOwner ? (
            <button
              className="inline-flex font-mono hover:bg-gray-200 gap-4 px-4 py-2 rounded-lg shrink items-center text-gray-700"
              aria-label="Edit snippet title"
              onClick={() => prompt("change_lang")}
            >
              <span>{language}</span>
            </button>
          ) : (
            <>{language && <p>{language}</p>}</>
          )}
        </div>
      </div>
    </>
  );
}
