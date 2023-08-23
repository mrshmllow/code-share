"use client";

import Card from "@/app/design/Card";
import Button from "@/app/design/button/Button";
import { createGistFromForm } from "./actions";
import { Cog6ToothIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function NewGistPage() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const session = useSession();

  return (
    <Card size="xl">
      <form action={createGistFromForm}>
        <Card.Header
          button={
            <Card.Button
              onClick={(e) => {
                e.preventDefault();
                console.log("settings");
              }}
            >
              <Cog6ToothIcon />
            </Card.Button>
          }
        >
          <Card.Title>New Snippet</Card.Title>
        </Card.Header>

        <textarea
          placeholder={'console.log("Hello World!")'}
          name="content"
          className="rounded-lg outline-none border-gray-300 border text-black focus-visible:border-indigo-500 p-2 h-40 bg-inherit w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <Button
          className="w-full"
          type="submit"
          onClick={() => {
            if (session.status !== "authenticated") {
              signIn();
            } else {
              setLoading(true);
            }
          }}
          isBusy={loading}
          disabled={text.length === 0}
        >
          <Button.Icon>
            <SparklesIcon />
          </Button.Icon>
          <Button.Text busyText={["Creat", "ing Snippet"]}>
            Create Snippet
          </Button.Text>
        </Button>
      </form>
    </Card>
  );
}
