"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[GlobalError]", error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white px-4 text-zinc-900">
        <div className="max-w-md text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
            Something went wrong
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            We hit an unexpected error.
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            The team has been notified. Try again, or head back to the front
            page.
          </p>
          {error.digest ? (
            <p className="mt-4 font-mono text-[11px] text-zinc-500">
              Reference: {error.digest}
            </p>
          ) : null}
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:border-zinc-500"
            >
              Front page
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
