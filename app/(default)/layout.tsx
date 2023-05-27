import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return <div className="px-4 sm:px-0 grid place-items-center">{children}</div>;
}
