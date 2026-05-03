import Link from "next/link";

export const metadata = {
  title: "Page not found",
  description: "We couldn't find that page on mynanganallur.in.",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-[var(--muted)]">
        That address isn’t on mynanganallur.in. Try the front page, or browse
        local news, jobs, events, and the directory below.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <Link
          href="/"
          className="rounded-full bg-[var(--accent)] px-4 py-2 font-medium text-white"
        >
          Front page
        </Link>
        <Link
          href="/local-news"
          className="rounded-full border border-[var(--border)] px-4 py-2 font-medium text-[var(--foreground)]"
        >
          Local news
        </Link>
        <Link
          href="/jobs"
          className="rounded-full border border-[var(--border)] px-4 py-2 font-medium text-[var(--foreground)]"
        >
          Jobs
        </Link>
        <Link
          href="/local-events"
          className="rounded-full border border-[var(--border)] px-4 py-2 font-medium text-[var(--foreground)]"
        >
          Events
        </Link>
        <Link
          href="/directory"
          className="rounded-full border border-[var(--border)] px-4 py-2 font-medium text-[var(--foreground)]"
        >
          Directory
        </Link>
      </div>
    </div>
  );
}
