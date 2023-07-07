import { env } from "@/app/env.mjs";
import algoliasearch from "algoliasearch";

const IS_PROD = process.env.NODE_ENV == "production";

const client = algoliasearch(env.NEXT_PUBLIC_ALGOLIA_ID, env.ALGOLIA_KEY);
export const index = client.initIndex(
  IS_PROD ? "prod_snippets" : "dev_snippets",
);
