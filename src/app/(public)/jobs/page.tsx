import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Chennai jobs and employer listings — coming soon.",
};

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <p className="text-sm font-medium text-[var(--accent)]">Jobs</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Work in Greater Chennai
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Job postings and employer accounts will use the Drizzle `job_postings`
        model. This page is a safe landing target from the home spotlight.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
