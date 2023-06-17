"use client";

import Spinner from "../design/icons/Spinner";
import { useContext, useRef, useState } from "react";
import { GistContext } from "./store";
import TextInput from "../design/form/TextInput";
import Button from "../design/button/Button";
import { experimental_useOptimistic as useOptimistic } from 'react'
import { updateName } from "./actions";

export default function GistPage() {
  const { gist, html } = useContext(GistContext);
  const [editing, setEditing] = useState(false)
  const [optimisticName, optimisticUpdateName] = useOptimistic<string | null, string | null>(
    gist.name,
    (_, name) => name,
  )

  const text = useRef<HTMLInputElement>(null)

  return (
    <div>
      <div className="border border-slate-700 rounded-lg">
        <div className="border-b border-slate-700 p-2">
          {!editing ?
            <button className="inline-flex hover:bg-slate-900 gap-4 px-4 py-2 rounded-lg shrink items-center text-slate-300 hover:text-white font-mono" onClick={() => {
              setEditing(true)
            }}>
              {!optimisticName ? (
                <>
                  <span>~/generting gist name</span>

                  <span className="w-5 h-5">
                    <Spinner />
                  </span>
                </>
              ) : (
                <span>{optimisticName}</span>
              )}
            </button> :
            <div className="flex gap-2">
              <TextInput placeholder="eg. main.py" full ref={text} defaultValue={optimisticName ? optimisticName : ""} />

              <Button intent="secondary" onClick={() => setEditing(false)}>
                <Button.Text>Cancel</Button.Text>
              </Button>

              <Button intent="primary" onClick={async () => {
                if (text.current === null) return;
                console.log(text.current.value)

                optimisticUpdateName(text.current.value)
                setEditing(false)

                await updateName({
                  id: gist.id,
                  name: text.current.value,
                })
              }}>
                <Button.Text>Save</Button.Text>
              </Button>
            </div>
          }
        </div>

        <div
          dangerouslySetInnerHTML={{
            __html: html,
          }}
          className="[&>pre]:overflow-x-auto p-2"
        ></div>
      </div>
    </div>
  );
}
