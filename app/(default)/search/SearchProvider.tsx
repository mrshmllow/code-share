"use client";

import algoliasearch from "algoliasearch/lite";
import { ReactNode } from "react";
import { InstantSearch } from "react-instantsearch-hooks-web";
import { env } from "../../env.mjs";

const searchClient = algoliasearch(env.NEXT_PUBLIC_ALGOLIA_ID, '2b64a02ac721d2a4e2fc9663344f65b7');

export default function SearchProvider({ children }: { children: ReactNode }) {
  return <InstantSearch searchClient={searchClient} indexName="dev_snippets">{children}</InstantSearch>;
}
