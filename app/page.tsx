"use client";

import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import Spinner from "./design/icons/Spinner";
import { useState } from "react";
import Button from "./design/button/Button";
import Card from "./design/Card";
import { submit } from "./actions";
import TextInput from "./design/form/TextInput";
import Form from "./design/form/Form";

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="grid place-items-center min-h-screen bg-slate-950">
      <Card>
        <Form action={submit}>
          <h1 className="text-xl font-bold mb-3">Create Gist</h1>

          <label htmlFor="title">
            Title
          </label>

          <TextInput placeholder="My Gist" name="title" />

          <Button
            intent="primary"
            busy={loading}
            onClick={() => {
              setLoading((loading) => !loading);
            }}
          >
            <Button.Icon busyIcon={<Spinner />}>
              <ArrowUpTrayIcon />
            </Button.Icon>

            <Button.Text busyText={["Upload", "ing..."]}>Upload</Button.Text>
          </Button>
        </Form>
      </Card>
    </main>
  );
}
