"use client";

import Card from "@/app/design/Card";
import Button from "@/app/design/button/Button";
import ButtonIcon from "@/app/design/button/ButtonIcon";
import ButtonText from "@/app/design/button/ButtonText";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react"

export default function SignUpPage() {
  const [isBusy, setIsBusy] = useState(false);

  return (
    <Card size="md">
      <Card.Header>
        <Card.Title>Create an account</Card.Title>
        <Card.Subtitle>to share code</Card.Subtitle>
      </Card.Header>

      <Button
        full
        isBusy={isBusy}
        onClick={async (e) => {
          e.preventDefault();

          setIsBusy(true);
          await signIn("github");
        }}
      >
        <ButtonText>Github</ButtonText>

        <ButtonIcon>
          <ArrowRightIcon />
        </ButtonIcon>
      </Button>

      <p className="mt-4">
        Have an account?{" "}
        <Link href="/sign-in" className="text-blue-400">
          Sign in.
        </Link>
      </p>
    </Card>
  );
}
