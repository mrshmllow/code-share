import { env } from '@/app/env.mjs';
import algoliasearch from 'algoliasearch';

const client = algoliasearch(env.NEXT_PUBLIC_ALGOLIA_ID, env.ALGOLIA_KEY);
export const index = client.initIndex('dev_snippets');
