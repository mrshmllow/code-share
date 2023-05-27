"use client";

import Card from "@/app/design/Card";
import Button from "@/app/design/button/Button";
import ButtonIcon from "@/app/design/button/ButtonIcon";
import ButtonText from "@/app/design/button/ButtonText";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTransition } from "react";
import { startGithubAuth } from "./actions";

export default function SignUpPage() {
  const [isBusy, startTransition] = useTransition();

  return (
    <Card size="md">
      <Card.Header subtitle="to share gists">Create your account</Card.Header>

      <Button
        full
        isBusy={isBusy}
        onClick={(e) => {
          e.preventDefault();

          startTransition(() => startGithubAuth())
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
