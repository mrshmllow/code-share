"use client";

import algoliasearch from "algoliasearch/lite";
import { ReactNode } from "react";
import { InstantSearch } from "react-instantsearch-hooks-web";
import { env } from "./env.mjs";

const searchClient = algoliasearch(
  env.NEXT_PUBLIC_ALGOLIA_ID,
  env.NEXT_PUBLIC_ALGOLIA_KEY
);
const IS_PROD = process.env.NODE_ENV == "production";

export default function SearchProvider({ children }: { children: ReactNode }) {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={IS_PROD ? "prod_snippets" : "dev_snippets"}
    >
      {children}
    </InstantSearch>
  );
}
