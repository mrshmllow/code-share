"use client";

import Card from "@/app/design/Card";
import Button from "@/app/design/button/Button";
import ButtonText from "@/app/design/button/ButtonText";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SignUpPage() {
  const [isBusy, setIsBusy] = useState(false);

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
            redirect: true,
          });
        }}
      >
        <ButtonText>Sign Out</ButtonText>
      </Button>
    </Card>
  );
}
