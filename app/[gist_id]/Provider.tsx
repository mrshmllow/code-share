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
  session,
}: {
  children: ReactNode;
  gist: Gist;
  html: string;
  session: Session | null;
}) {
  const [gistValue, setGist] = useState(gist);

  return (
    <GistContext.Provider
      value={{
        html,
        gist: gistValue,
        isOwner: session?.user?.id === gistValue.owner,
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
