"use client";

import Card from "@/app/design/Card";
import Button from "@/app/design/button/Button";
import ButtonishLink from "@/app/design/button/ButtonishLink";
import { CodeBracketSquareIcon } from "@heroicons/react/24/outline";

export default function GetPage() {
  return (
    <Card size="lg">
      <Card.Header>
        <Card.Title>Get Resources</Card.Title>
      </Card.Header>

      <div className="space-y-2">
        <ButtonishLink href="https://github.com/mrshmllow/gist-share" full>
          <Button.Icon>
            <CodeBracketSquareIcon />
          </Button.Icon>

          <Button.Text>Project Code</Button.Text>
        </ButtonishLink>

        <ButtonishLink
          href="https://snip.cafe/JpD5IR6cU9KpJSsD8-kOz/Gi7tm6w6fHoebYjLIcgIc"
          target="_blank"
          full
          intent={"secondary"}
        >
          <Button.Text>View Example Snippet</Button.Text>
        </ButtonishLink>
      </div>
    </Card>
  );
}
