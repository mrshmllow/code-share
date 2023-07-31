import { db } from "@/db/db";
import { gists, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { useProfileStore } from "./store";
import StoreInitalizer from "@/lib/StoreInitalize";

export default async function ProfileLayout({
  params: { user_id },
  children,
}: {
  params: { user_id: string };
  children: ReactNode;
}) {
  const profile = await db.query.users.findFirst({
    where: eq(users.id, user_id),
    columns: {
      email: false,
      emailVerified: false,
    },
    with: {
      gists: {
        where: eq(gists.visible, true),
        columns: {
          aiCompleted: false,
          aiNameReason: false,
          aiTags: false,
          owner: false,
        },
      },
    },
  });

  if (!profile) {
    return notFound();
  }

  return (
    <>
      <StoreInitalizer state={profile} store={useProfileStore} />

      {children}
    </>
  );
}
