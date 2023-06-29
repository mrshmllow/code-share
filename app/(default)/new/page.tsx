"use client";

import Card from "@/app/design/Card";
import Button from "@/app/design/button/Button";
import { createGistFromForm } from "./actions";

export default function NewGistPage() {
  return (
    <Card size="lg">
      <form action={createGistFromForm}>
        <Card.Header>
          <Card.Title>New Gist</Card.Title>
        </Card.Header>

        <textarea
          placeholder={'console.log("Hello World!")'}
          name="content"
          className="rounded-lg outline-none border-gray-300 border text-black focus-visible:border-indigo-500 p-2 h-40 bg-inherit w-full"
        ></textarea>

        <Button className="w-full" type="submit">
          <Button.Text>Create Gist</Button.Text>
        </Button>
      </form>
    </Card>
  );
}
