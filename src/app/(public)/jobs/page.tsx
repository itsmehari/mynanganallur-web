import Link from "next/link";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { ListingCardJob } from "@/components/listings/listing-card-job";
import { ListingEmptyState } from "@/components/listings/listing-empty-state";
import { ListingFilterRow } from "@/components/listings/listing-filter-row";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { ListingHubShell } from "@/components/listings/listing-hub-shell";
import { ListingHubSeoScripts } from "@/components/listings/listing-hub-seo-scripts";
import { ResponsiveAdSlot } from "@/components/listings/responsive-ad-slot";
import type { FilterChip } from "@/components/listings/listing-filter-chips";
import { listOpenJobsForSite } from "@/domains/jobs";
import { searchAcross } from "@/domains/search";
import { LISTING_HUB_CONTENT } from "@/lib/listings/hub-content";
import { getSiteUrl } from "@/lib/env";
import { buildHubMetadata } from "@/lib/seo/hub-page-metadata";

export const revalidate = 120;

const HUB = LISTING_HUB_CONTENT.jobs;

const MODE_CHIPS: FilterChip[] = [
  { label: "All modes", param: "mode", value: null },
  { label: "Onsite", param: "mode", value: "onsite" },
  { label: "Hybrid", param: "mode", value: "hybrid" },
  { label: "Remote", param: "mode", value: "remote" },
];

export const metadata = buildHubMetadata({
  path: HUB.path,
  title: HUB.metaTitle,
  description: HUB.metaDescription,
  keywords: HUB.keywords,
  ogKind: HUB.ogKind,
  ogTitle: HUB.ogTitle,
});

function matchesMode(remotePolicy: string, mode: string | null): boolean {
  if (!mode) return true;
  const p = remotePolicy.toLowerCase();
  if (mode === "remote") return p.includes("remote") || p.includes("online");
  if (mode === "hybrid") return p.includes("hybrid");
  if (mode === "onsite") return p === "onsite" || (!p.includes("remote") && !p.includes("hybrid") && !p.includes("online"));
  return true;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locality?: string; mode?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || null;
  const locality = sp.locality?.trim() || null;
  const mode =
    sp.mode === "onsite" || sp.mode === "hybrid" || sp.mode === "remote"
      ? sp.mode
      : null;

  let rows: Awaited<ReturnType<typeof listOpenJobsForSite>> = [];
  try {
    if (q || locality) {
      const search = await searchAcross({ q, locality, type: "job", limit: 25 });
      const all = await listOpenJobsForSite(200);
      const ids = new Set(search.hits.job.map((h) => h.id));
      rows = all.filter((r) => ids.has(r.job.id));
    } else {
      rows = await listOpenJobsForSite(80);
    }
  } catch {
    /* DATABASE_URL unset */
  }

  if (mode) {
    rows = rows.filter(({ job }) => matchesMode(job.remotePolicy, mode));
  }

  const pageUrl = `${getSiteUrl()}${HUB.path}`;
  const filterParams = {
    q: q ?? undefined,
    locality: locality ?? undefined,
    mode: mode ?? undefined,
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
      <ListingHubSeoScripts
        hubPath={HUB.path}
        hubName={HUB.itemListName}
        description={HUB.metaDescription}
        breadcrumbLabel="Jobs"
        items={rows.map(({ job }) => ({
          name: job.title,
          href: `/jobs/${job.slug}`,
        }))}
      />

      <ListingHubShell
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Jobs", href: HUB.path },
        ]}
        eyebrow={HUB.eyebrow}
        h1={HUB.h1}
        intro={HUB.intro}
        hubPath={HUB.path}
      />

      <ListingGeoBlock
        question={HUB.geoQuestion}
        directAnswer={HUB.geoDirectAnswer}
        localityLine={HUB.localityLine}
      />

      <ListingFilterRow
        action={HUB.path}
        q={q ?? undefined}
        locality={locality ?? undefined}
        qPlaceholder="Search jobs by title, employer, body…"
        chips={MODE_CHIPS}
        currentParams={filterParams}
      />

      <ResponsiveAdSlot
        slotId="jobs-posting-468"
        pagePath={HUB.path}
        desktopSize="468x60"
        mobileSize="320x50"
        className="mt-8 flex w-full justify-center"
      />

      {rows.length === 0 ? (
        <ListingEmptyState
          title={HUB.emptyTitle}
          body={HUB.emptyBody}
          ctaHref={HUB.emptyCtaHref}
          ctaLabel={HUB.emptyCtaLabel}
        />
      ) : (
        <ul className="mt-8 space-y-3 sm:mt-10">
          {rows.map(({ job, employer }) => (
            <ListingCardJob
              key={job.id}
              slug={job.slug}
              title={job.title}
              employerName={employer.name}
              locationLabel={job.locationLabel}
              remotePolicy={job.remotePolicy}
              salaryDisclosed={job.salaryDisclosed}
              salaryMin={job.salaryMin}
              salaryMax={job.salaryMax}
              createdAt={job.createdAt}
              featured={job.featured}
            />
          ))}
        </ul>
      )}

      <ResponsiveAdSlot
        slotId="jobs-index-mid"
        pagePath={HUB.path}
        className="mt-10"
      />

      <FaqBlock items={HUB.faq} pageUrl={pageUrl} heading="Frequently asked questions" />

      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-jobs"
        className="mt-10 max-w-xl"
      />

      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
