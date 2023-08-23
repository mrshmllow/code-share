import { ReactNode } from "react";
import Header from "../Header";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 grid place-items-center py-4 md:py-8">
        {children}
      </div>
    </div>
  );
}
