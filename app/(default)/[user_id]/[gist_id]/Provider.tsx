"use client";

import { Gist } from "@/db/schema";
import { ReactNode, useState } from "react";
import { GistContext } from "./store";
import NameUpdater from "./NameUpdater";
import { Session } from "next-auth";

export function Provider({
  children,
  gist,
  html,
  language,
  session,
}: {
  children: ReactNode;
  gist: Gist;
  html: string;
  session: Session | null;
  language: string | null;
}) {
  const [gistValue, setGist] = useState(gist);

  return (
    <GistContext.Provider
      value={{
        html,
        gist: gistValue,
        isOwner: session?.user?.id === gistValue.owner,
        language,
        updateName: (obj) =>
          setGist({
            ...gist,
            ...obj,
          }),
      }}
    >
      {gistValue.name === null && <NameUpdater />}

      {children}
    </GistContext.Provider>
  );
}
