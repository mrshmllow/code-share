"use client";

import Spinner from "../design/icons/Spinner";
import { useContext, useRef, useState } from "react";
import { GistContext } from "./store";
import TextInput from "../design/form/TextInput";
import Button from "../design/button/Button";
import { experimental_useOptimistic as useOptimistic } from "react";
import { updateName } from "./actions";
import { ClipboardIcon } from "@heroicons/react/24/outline";

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
          <span>~/generting gist name</span>

          <span className="w-5 h-5">
            <Spinner />
          </span>
        </>
      ) : !name ? (
        <em>untitled gist</em>
      ) : (
        <span>{name}</span>
      )}
    </>
  );
}

export default function GistPage() {
  const { gist, isOwner, html } = useContext(GistContext);
  const [editing, setEditing] = useState(false);
  const [optimisticName, optimisticUpdateName] = useOptimistic<
    string | null,
    string | null
  >(gist.name, (_, name) => name);
  const text = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="border border-slate-700 rounded-lg">
        <div className="border-b border-slate-700 p-2 flex justify-between">
          {!editing ? (
            <>
              <span aria-hidden="true" className="sr-only">
                {optimisticName}
              </span>

              {isOwner ? (
                <button
                  className="inline-flex font-mono hover:bg-slate-900 gap-4 px-4 py-2 rounded-lg shrink items-center text-slate-300 hover:text-white"
                  aria-label="Edit gist title"
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  <NameContent aiCompleted={gist.aiCompleted} name={optimisticName} />
                </button>
              ) : (
                <p className="inline-flex items-center gap-4 px-4 py-2 font-mono text-slate-300">
                  <NameContent aiCompleted={gist.aiCompleted} name={optimisticName} />
                </p>
              )}

              <Button
                aria-label="Copy gist to clipboard"
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
                setEditing(false);

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

              <Button intent="secondary" onClick={() => setEditing(false)}>
                <Button.Text>Cancel</Button.Text>
              </Button>
            </form>
          )}
        </div>

        <div className="flex flex-row p-2 overflow-auto">
          <div className="flex flex-col font-mono px-4">
            {[...Array((gist.text.match(/\n/g) || "").length + 1)].map(
              (_, i) => (
                <a href={`#L${i + 1}`} key={i} className="" id={`L${i + 1}`}>
                  {i + 1}
                </a>
              )
            )}
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: html,
            }}
            className="[&>pre]:overflow-x-auto"
          ></div>
        </div>
      </div>
    </div>
  );
}
