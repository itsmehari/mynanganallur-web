import type { Metadata } from "next";
import Link from "next/link";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { NewspaperGrid, NewspaperMasthead } from "@/components/news/newspaper-layout";
import { listPublishedArticlesForSite } from "@/domains/news";
import { getSiteUrl } from "@/lib/env";
import { AdSlot, buildRotationSeed } from "@/ads";

export const metadata: Metadata = {
  title: "Local news",
  description:
    "Nanganallur local news with editorial analysis — newspaper-style front page from mynanganallur.in.",
  alternates: {
    canonical: `${getSiteUrl()}/local-news`,
    types: {
      "application/rss+xml": `${getSiteUrl()}/local-news/feed.xml`,
    },
  },
  openGraph: {
    title: "Local news · mynanganallur.in",
    url: `${getSiteUrl()}/local-news`,
    type: "website",
  },
};

export const revalidate = 120;

export default async function LocalNewsPage() {
  let all: Awaited<ReturnType<typeof listPublishedArticlesForSite>> = [];
  try {
    all = await listPublishedArticlesForSite(60);
  } catch {
    /* DATABASE_URL unset or DB unreachable */
  }
  if (!all.length) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-14">
        <NewspaperMasthead />
        <p className="mt-10 text-[var(--muted)]">
          No articles yet. Run{" "}
          <code className="rounded bg-[var(--surface)] px-1 ring-1 ring-[var(--border)]">
            npm run db:seed
          </code>{" "}
          with{" "}
          <code className="rounded bg-[var(--surface)] px-1 ring-1 ring-[var(--border)]">
            DATABASE_URL
          </code>{" "}
          set.
        </p>
        <AdSlot
          slotId="content-top"
          size="728x90"
          seed={buildRotationSeed("/local-news", "content-top")}
          className="mt-10 max-w-full"
        />
        <AmazonAffiliateBlock
          variant="compact"
          placement="hub-local-news"
          className="mt-10 max-w-md"
        />
        <Link href="/" className="mt-6 inline-block text-[var(--accent)]">
          Home
        </Link>
      </div>
    );
  }
  const [lead, ...rest] = all;
  const featuredOnly = all.filter((a) => a.featured);
  const featuredSide = (featuredOnly.length > 0 ? featuredOnly : rest).slice(
    0,
    5,
  );

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14">
      <NewspaperMasthead />
      <AdSlot
        slotId="content-top"
        size="728x90"
        seed={buildRotationSeed("/local-news", "content-top")}
        className="mt-6 max-w-full"
      />
      <NewspaperGrid
        lead={lead}
        rest={rest}
        sidebar={
          <>
            <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
              Editor&apos;s notebook
            </h2>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Quick links to featured pieces. Full list in the main columns.
            </p>
            <ul className="mt-4 space-y-3">
              {featuredSide.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/local-news/${a.slug}`}
                    className="text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
            <AdSlot
              slotId="sidebar"
              size="300x250"
              seed={buildRotationSeed("/local-news", "sidebar")}
              className="mt-6"
            />
            <AmazonAffiliateBlock
              variant="rail"
              placement="hub-local-news"
              className="mt-8"
            />
            <Link
              href="/"
              className="mt-6 inline-block text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Back to home
            </Link>
          </>
        }
      />
    </div>
  );
}
