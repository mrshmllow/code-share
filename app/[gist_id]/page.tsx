"use client";

import Spinner from "../design/icons/Spinner";
import { useContext, useEffect, useState } from "react";
import { GistContext } from "./store";

export default function GistPage({
  params: { gist_id },
}: {
  params: {
    gist_id: string;
  };
}) {
  const gist = useContext(GistContext);
  const [name, setName] = useState(gist?.name);
  const [reason, setReason] = useState(gist?.aiNameReason);
  const [inter, setInter] = useState(false);

  useEffect(() => {
    if (inter || name) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/name/${gist_id}`, {
        next: {
          tags: [`${gist_id}.name`],
          revalidate: 10,
        },
      });

      if (!res.ok) {
        clearInterval(interval);
      }

      const { name, aiNameReason } = (await res.json()) as {
        name: string | null;
        aiNameReason: string;
      };

      setName(name);
      setReason(aiNameReason);

      if (name) clearInterval(interval);
    }, 3000);

    setInter(true);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <em className="mb-3">Beta gist-view page</em>

      {!name ? (
        <>
          <p className="flex items-center gap-3">
            <span className="w-3 h-3">
              <Spinner />
            </span>
            Generating a Name...
          </p>
        </>
      ) : (
        <p title={reason!}>{name}</p>
      )}

      <div className="border border-slate-700 p-4 rounded-lg">{gist?.text}</div>
    </div>
  );
}
