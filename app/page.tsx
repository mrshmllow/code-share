"use client";

import { Balancer } from "react-wrap-balancer";
import NewGistPage from "./(default)/new/page";

export default function Home() {
  return (
    <main className="relative">
      {/*<div className="pattern-wavy pattern-slate-800 pattern-bg-white pattern-size-8 pattern-opacity-20 absolute -top-24 left-0 w-full h-[calc(100%+6rem)] -z-10" />*/}

      <div className="px-4 pb-10 flex flex-col sm:items-center">
        <Balancer
          as="h1"
          className="text-4xl sm:text-6xl lg:text-7xl text-center my-8 sm:my-12 font-bold tracking-tight mx-auto"
        >
          Easily Share Code
        </Balancer>

        <NewGistPage />
      </div>
    </main>
  );
}
