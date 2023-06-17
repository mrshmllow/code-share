import { cx } from "cva";
import ClientProviders from "./ClientProviders";
import "./globals.css";
import { Atkinson_Hyperlegible } from "next/font/google";
import Header from "./Header";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route"

const ak = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Gist Share",
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
      <body className={cx(ak.className, "text-slate-50 bg-slate-950")}>
        <ClientProviders session={session}>
          <Header />

          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
