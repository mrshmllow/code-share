import { useChannel, useEvent } from "@harelpls/use-pusher";
import { useContext } from "react";
import { GistContext } from "./store";

export default function NameUpdater() {
  const { gist, updateName } = useContext(GistContext);
  const channel = useChannel(`gist-update.${gist.id}`);

  useEvent<{ name: string; aiNameReason: string | null }>(
    channel,
    "name",
    (data) => data && updateName({
      ...data,
      aiCompleted: true
    })
  );

  return <></>;
}
