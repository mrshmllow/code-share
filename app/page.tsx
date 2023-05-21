"use client";

import Button from "./design/Button";

export default function Home() {
  return (
    <main className="grid place-items-center min-h-screen bg-slate-950">
      <div className="flex flex-col gap-2">
        <Button intent="primary">
          <Button.Text>Upload</Button.Text>

          <Button.BusyText modifier="ing...">Upload</Button.BusyText>
        </Button>

        <Button intent="secondary">
          <Button.Text>Upload</Button.Text>

          <Button.BusyText modifier="ing...">Upload</Button.BusyText>
        </Button>
      </div>
    </main>
  );
}
