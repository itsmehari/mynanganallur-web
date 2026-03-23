import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News",
  description:
    "Chennai local news and civic reporting — Articles MVP coming soon.",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <p className="text-sm font-medium text-[var(--accent)]">News desk</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Latest from Greater Chennai
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        The articles pipeline (slug URLs, JSON-LD, sitemap expansion) is next on
        the roadmap. You&apos;re seeing a routed placeholder so navigation from
        the home page never 404s.
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
