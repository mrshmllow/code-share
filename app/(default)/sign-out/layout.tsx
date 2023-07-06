import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default async function SignOutLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session === null) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
