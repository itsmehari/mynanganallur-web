import type { Metadata } from "next";
import Link from "next/link";
import { mockJobs } from "@/lib/home-mock";

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "Chennai jobs: curated tech and editorial picks — links to employer career sites. Full apply-on-site flow coming soon.",
};

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <p className="text-sm font-medium text-[var(--accent)]">Jobs</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Work in Greater Chennai
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Hand-picked openings from Chennai tech employers (snapshot{" "}
        <strong className="font-medium text-[var(--foreground)]">25 Mar 2026</strong>
        ). External rows open the company careers site — always confirm the JD
        there. In-product applications will use our job board model later.
      </p>

      <ul className="mt-10 space-y-4">
        {mockJobs.map((j) => (
          <li
            key={`${j.href}-${j.title}`}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-sm"
          >
            {j.external ? (
              <a
                href={j.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[var(--foreground)] transition hover:text-[var(--accent)]"
              >
                <span className="text-sm font-semibold">{j.title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  {j.company} · {j.location} · opens in new tab
                </span>
              </a>
            ) : (
              <div className="text-[var(--foreground)]">
                <span className="text-sm font-semibold">{j.title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  {j.company} · {j.location} · apply on site (soon)
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Link
        href="/"
        className="mt-10 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
