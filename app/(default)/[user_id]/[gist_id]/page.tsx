"use client";

import Spinner from "@/app/design/icons/Spinner";
import { startTransition, useContext, useRef, useState } from "react";
import { GistContext } from "./store";
import TextInput from "@/app/design/form/TextInput";
import Button from "@/app/design/button/Button";
import { experimental_useOptimistic as useOptimistic } from "react";
import { updateLanguage, updateName } from "./actions";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import "@catppuccin/highlightjs/sass/catppuccin-latte.scss";
import ChooseLanguagePopup from "@/app/design/ChooseLanguagePopup";

function NameContent({
  name,
  aiCompleted,
}: {
  name: string | null;
  aiCompleted: boolean;
}) {
  return (
    <>
      {!name && !aiCompleted ? (
        <>
          <span>~/generting snippet name</span>

          <span className="w-5 h-5">
            <Spinner />
          </span>
        </>
      ) : !name ? (
        <em>untitled snippet</em>
      ) : (
        <span>{name}</span>
      )}
    </>
  );
}

export default function GistPage() {
  const { gist, language, isOwner, html } = useContext(GistContext);
  const [editing, setEditing] = useState<"name" | "lang" | null>(null);
  const [optimisticName, optimisticUpdateName] = useOptimistic<
    string | null,
    string | null
  >(gist.name, (_, name) => name);
  const text = useRef<HTMLInputElement>(null);

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

              <Button
                aria-label="Copy snippet to clipboard"
                onClick={async () => {
                  await navigator.clipboard.writeText(gist.text);
                }}
              >
                <Button.Icon>
                  <ClipboardIcon />
                </Button.Icon>
              </Button>
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
                placeholder="eg. main.py"
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
              onClick={() => setEditing("lang")}
            >
              <span>{language}</span>

              <ChooseLanguagePopup
                isOpen={editing === "lang"}
                initalLanguage={gist.language}
                onPickLanguage={async (language) => {
                  await updateLanguage({
                    id: gist.id,
                    language,
                  });
                }}
                thenFinally={() => setEditing(null)}
              />
            </button>
          ) : (
            <>{language && <p>{language}</p>}</>
          )}
        </div>
      </div>
    </>
  );
}
