"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PublicError({ error, reset }: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[PublicError]", error);
    }
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
        Page error
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        We couldn’t load this page.
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        It’s probably a hiccup at our end. Try again, or pick another section.
      </p>
      {error.digest ? (
        <p className="mt-4 font-mono text-[11px] text-[var(--muted)]">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-[var(--accent)] px-4 py-2 font-medium text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-[var(--border)] px-4 py-2 font-medium text-[var(--foreground)]"
        >
          Front page
        </Link>
      </div>
    </div>
  );
}
