import { ReactNode } from "react";
import SearchProvider from "./SearchProvider";

export default function SearchLayout({ children }: { children: ReactNode }) {
  return <SearchProvider>{children}</SearchProvider>;
}
