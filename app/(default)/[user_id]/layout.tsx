import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function ProfileLayout({
  params: { user_id },
  children,
}: {
  params: { user_id: string };
  children: ReactNode;
}) {
  const profile = await db.query.users.findFirst({
    where: eq(users.id, user_id),
  });

  if (!profile) {
    return notFound();
  }

  return <>{children}</>;
}
