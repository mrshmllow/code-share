import { ReactNode } from "react";
import Header from "../Header";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 grid place-items-center">{children}</div>
    </div>
  );
}
