import { cx } from "cva";
import ClientProviders from "./ClientProviders";
import "./globals.css";
import { Atkinson_Hyperlegible } from "next/font/google";
import Header from "./Header";

const ak = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Gist Share",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(ak.className, "text-slate-50 bg-slate-950")}>
        <ClientProviders>
          <Header />

          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
