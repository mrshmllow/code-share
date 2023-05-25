"use client";

import { Gist } from "@/db/schema";
import { ReactNode, useState } from "react";
import { GistContext } from "./store";
import NameUpdater from "./NameUpdater";

export function Provider({
  children,
  gist,
}: {
  children: ReactNode;
  gist: Gist;
}) {
  const [gistValue, setGist] = useState(gist);

  return (
    <GistContext.Provider
      value={{
        gist: gistValue,
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
