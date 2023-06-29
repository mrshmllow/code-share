import { cx } from "cva";
import ClientProviders from "./ClientProviders";
import "./globals.css";
import { Atkinson_Hyperlegible } from "next/font/google";
import Header from "./Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const ak = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Snippet Share",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={cx(ak.className, "text-black bg-white min-h-screen")}>
        <ClientProviders session={session}>
          <Header />

          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
