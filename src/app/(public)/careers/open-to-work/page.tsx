import Link from "next/link";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { ListingCardOpenToWork } from "@/components/listings/listing-card-open-to-work";
import { ListingHubSubmitCta } from "@/components/listings/listing-hub-submit-cta";
import { ListingEmptyState } from "@/components/listings/listing-empty-state";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { ListingHubShell } from "@/components/listings/listing-hub-shell";
import { ListingHubSeoScripts } from "@/components/listings/listing-hub-seo-scripts";
import { listOpenProfilesForSite } from "@/domains/open-to-work";
import { getSiteUrl } from "@/lib/env";
import { OPEN_TO_WORK_HUB } from "@/lib/open-to-work/hub-content";
import { buildHubMetadata } from "@/lib/seo/hub-page-metadata";

export const revalidate = 120;

const HUB = OPEN_TO_WORK_HUB;

export const metadata = buildHubMetadata({
  path: HUB.path,
  title: HUB.metaTitle,
  description: HUB.metaDescription,
  keywords: [...HUB.keywords],
  ogKind: "job",
  ogTitle: HUB.ogTitle,
});

function matchesQuery(
  profile: Awaited<ReturnType<typeof listOpenProfilesForSite>>[number],
  q: string,
): boolean {
  const hay = [
    profile.displayName,
    profile.headline,
    profile.body,
    profile.domainsLabel,
    profile.preferredLocations,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

export default async function OpenToWorkHubPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || null;

  let rows: Awaited<ReturnType<typeof listOpenProfilesForSite>> = [];
  try {
    rows = await listOpenProfilesForSite(80);
    if (q) {
      rows = rows.filter((p) => matchesQuery(p, q));
    }
  } catch {
    /* DATABASE_URL unset */
  }

  const pageUrl = `${getSiteUrl()}${HUB.path}`;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
      <ListingHubSeoScripts
        hubPath={HUB.path}
        hubName={HUB.itemListName}
        description={HUB.metaDescription}
        breadcrumbLabel="Open to Work"
        items={rows.map((p) => ({
          name: `${p.displayName} — ${p.headline}`,
          href: `/careers/open-to-work/${p.slug}`,
        }))}
      />

      <ListingHubShell
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Jobs", href: "/jobs" },
          { name: "Open to Work", href: HUB.path },
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

      <ListingHubSubmitCta
        title="Share your profile"
        body="Looking for a role or referral? Tell us your experience and preferred locations. We publish after a quick review."
        ctaHref={HUB.emptyCtaHref}
        ctaLabel={HUB.emptyCtaLabel}
        secondaryHref="/jobs"
        secondaryLabel="Browse open roles"
      />

      <form action={HUB.path} method="get" className="mt-8 flex flex-wrap gap-3">
        <label className="sr-only" htmlFor="q">
          Search profiles
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q ?? ""}
          placeholder="Search by name, skills, location…"
          className="min-h-11 min-w-[min(100%,16rem)] flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--foreground)]"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white"
        >
          Search
        </button>
      </form>

      {rows.length === 0 ? (
        <ListingEmptyState
          title={HUB.emptyTitle}
          body={HUB.emptyBody}
          ctaHref={HUB.emptyCtaHref}
          ctaLabel={HUB.emptyCtaLabel}
        />
      ) : (
        <ul className="mt-8 space-y-3 sm:mt-10">
          {rows.map((p) => (
            <ListingCardOpenToWork
              key={p.id}
              slug={p.slug}
              displayName={p.displayName}
              headline={p.headline}
              domainsLabel={p.domainsLabel}
              preferredLocations={p.preferredLocations}
              workModePreferences={p.workModePreferences}
              yearsExperience={p.yearsExperience}
              publishedAt={p.publishedAt}
              createdAt={p.createdAt}
              featured={p.featured}
            />
          ))}
        </ul>
      )}

      <FaqBlock items={[...HUB.faq]} pageUrl={pageUrl} heading="Frequently asked questions" />

      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-jobs"
        className="mt-10 max-w-xl"
      />

      <Link
        href="/jobs"
        className="mt-8 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Open roles (employers hiring)
      </Link>
    </div>
  );
}
