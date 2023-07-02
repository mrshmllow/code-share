"use client";

import {
  useSearchBox,
  Hits,
  Highlight,
  useHits,
  usePagination,
  Configure,
  Snippet,
} from "react-instantsearch-hooks-web";
import TextInput from "../../design/form/TextInput";
import Link from "next/link";
import Card from "../../design/Card";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { cx } from "cva";
import { useBreakpointValue } from "@/lib/tailwindHooks";

export default function SearchPage() {
  const search = useSearchBox();
  const padding = useBreakpointValue("sm", 4, 1);
  const { hits } = useHits();
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    canRefine,
    refine,
    createURL,
  } = usePagination({
    padding,
  });

  return (
    <>
      <Card size="xl" shadow={false}>
        <Card.Header>
          <Card.Title>Search Snippets</Card.Title>
          <Card.Header>
            Easily search for titles and through their first few lines of code
          </Card.Header>
        </Card.Header>

        <TextInput
          className="w-full"
          placeholder="Search Snippet Share..."
          autoFocus
          onChange={(e) => {
            e.preventDefault();

            search.refine(e.target.value);
          }}
        ></TextInput>
      </Card>

      <Configure hitsPerPage={10} />

      <div className="w-full max-w-xl mt-5">
        <Hits
          hitComponent={({ hit }) => (
            <Link
              className="rounded-lg border border-gray-200 mt-5 flex flex-col overflow-clip"
              href={`/${hit.objectID}`}
            >
              <pre className="border-b p-4 flex flex-col break-all whitespace-pre-wrap max-h-40 gradient-mask-b-80">
                <code className="">
                  <Snippet hit={hit} attribute={"text"}></Snippet>
                </code>
              </pre>

              <div className="px-4 py-2 bg-gray-100">
                <h2 className="font-mono">
                  {hit["name"] === null ? (
                    <em>Untitled Gist</em>
                  ) : (
                    <Highlight attribute={"name"} hit={hit} />
                  )}
                </h2>
              </div>
            </Link>
          )}
        />

        {hits.length === 0 && <p className="pt-5">No snippets found</p>}
      </div>

      {canRefine && (
        <div className="flex flex-row gap-2 items-center text-lg w-full justify-center pt-5">
          <Link
            href={createURL(0)}
            onClick={(e) => {
              e.preventDefault();
              refine(0);
            }}
            aria-label="go to first page"
            className={cx(
              "w-10 h-10 p-2 hover:bg-gray-100 rounded-full hidden sm:block",
              isFirstPage && "invisible"
            )}
            aria-hidden={isFirstPage}
          >
            <ChevronDoubleLeftIcon />
          </Link>

          <Link
            href={createURL(2)}
            onClick={(e) => {
              e.preventDefault();
              refine(currentRefinement - 1);
            }}
            aria-label="go to previous page"
            className={cx(
              "w-10 h-10 p-2 hover:bg-gray-100 rounded-full",
              isFirstPage && "invisible"
            )}
            aria-hidden={isFirstPage}
          >
            <ChevronLeftIcon />
          </Link>

          <ul className="flex flex-row">
            {pages.map((page) => (
              <li key={page}>
                <Link
                  href={createURL(page)}
                  onClick={(event) => {
                    event.preventDefault();
                    refine(page);
                  }}
                  className={cx(
                    "w-10 h-10 rounded-full inline-flex items-center justify-center",
                    currentRefinement === page
                      ? "bg-indigo-500 text-white hover:bg-indigo-600"
                      : "hover:bg-gray-100"
                  )}
                >
                  {page + 1}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={createURL(currentRefinement + 1)}
            onClick={(e) => {
              e.preventDefault();
              refine(currentRefinement + 1);
            }}
            aria-label="go to next page"
            className={cx(
              "w-10 h-10 p-2 hover:bg-gray-100 rounded-full",
              isLastPage && "invisible"
            )}
            aria-hidden={isLastPage}
          >
            <ChevronRightIcon />
          </Link>

          <Link
            href={createURL(nbPages - 1)}
            onClick={(e) => {
              e.preventDefault();
              refine(nbPages - 1);
            }}
            aria-label="go to last page"
            className={cx(
              "w-10 h-10 p-2 hover:bg-gray-100 rounded-full hidden sm:block",
              isLastPage && "invisible"
            )}
            aria-hidden={isLastPage}
          >
            <ChevronDoubleRightIcon />
          </Link>
        </div>
      )}
    </>
  );
}
