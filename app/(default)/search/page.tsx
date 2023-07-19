"use client";

import {
  useSearchBox,
  Hits,
  useHits,
  usePagination,
  Configure,
  useRefinementList,
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
import GistHit from "@/app/design/GistCard";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
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

  const {
    refine: langRefine,
    canRefine: canLangRefine,
    items,
  } = useRefinementList({
    attribute: "language",
  });

  useEffect(() => {
    const query = searchParams.get("search");

    query !== null && search.refine(query);
  }, []);

  return (
    <>
      <Configure hitsPerPage={10} />

      <div className="sm:min-w-[48rem] mb-8">
        <Card size="full" shadow={false}>
          <Card.Header>
            <Card.Title>Search Snippets</Card.Title>
            <Card.Header>
              Easily search for titles and through their first few lines of code
            </Card.Header>
          </Card.Header>

          <TextInput
            className="w-full"
            placeholder="Search Snippet Share..."
            defaultValue={
              searchParams.get("search") ?? searchParams.get("search")!
            }
            autoFocus
            onChange={(e) => {
              e.preventDefault();

              search.refine(e.target.value);
            }}
          ></TextInput>
        </Card>

        <div className="w-full flex flex-col md:flex-row sm:gap-4 sm:mt-5">
          <div className="md:sticky block top-10 mt-5 h-fit gap-2 sm:w-1/3">
            <section className="flex flex-col border border-gray-300 rounded-lg p-4">
              <h2 className="font-bold mb-2">Language</h2>

              {canLangRefine ? (
                <>
                  {items.map((item) => (
                    <div key={item.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={item.label}
                        checked={item.isRefined}
                        onChange={(e) => {
                          e.preventDefault();

                          langRefine(item.label);
                        }}
                      />
                      <label htmlFor={item.label}>{item.label}</label>
                    </div>
                  ))}
                </>
              ) : (
                <em>None Found</em>
              )}
            </section>
          </div>

          <div className="w-full">
            <Hits hitComponent={({ hit }) => <GistHit hit={hit} />} />

            {hits.length === 0 && <p className="pt-5">No snippets found</p>}

            {canRefine && (
              <div className="flex flex-row gap-2 items-center text-lg w-full justify-center py-5">
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
          </div>
        </div>
      </div>
    </>
  );
}
