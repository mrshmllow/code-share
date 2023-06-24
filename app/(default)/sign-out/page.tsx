"use client";

import Card from "@/app/design/Card";
import Button from "@/app/design/button/Button";
import ButtonText from "@/app/design/button/ButtonText";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [isBusy, setIsBusy] = useState(false);
  const router = useRouter();

  return (
    <Card size="md">
      <Card.Header>
        <Card.Title>Sign Out</Card.Title>
        <Card.Subtitle>Are you sure you want to sign out?</Card.Subtitle>
      </Card.Header>

      <Button
        full
        isBusy={isBusy}
        onClick={async (e) => {
          e.preventDefault();

          setIsBusy(true);
          await signOut({
            redirect: false,
          });
          router.push("/sign-in");
        }}
      >
        <ButtonText>Sign Out</ButtonText>
      </Button>
    </Card>
  );
}
