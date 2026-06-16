import Link from "next/link";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { ListingCardEvent } from "@/components/listings/listing-card-event";
import { ListingHubSubmitCta } from "@/components/listings/listing-hub-submit-cta";
import { ListingEmptyState } from "@/components/listings/listing-empty-state";
import { ListingFilterRow } from "@/components/listings/listing-filter-row";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { ListingHubShell } from "@/components/listings/listing-hub-shell";
import { ListingHubSeoScripts } from "@/components/listings/listing-hub-seo-scripts";
import { ResponsiveAdSlot } from "@/components/listings/responsive-ad-slot";
import type { FilterChip } from "@/components/listings/listing-filter-chips";
import { listUpcomingEventsForSite } from "@/domains/events";
import { searchAcross } from "@/domains/search";
import { LISTING_HUB_CONTENT } from "@/lib/listings/hub-content";
import { getSiteUrl } from "@/lib/env";
import { buildHubMetadata } from "@/lib/seo/hub-page-metadata";

export const revalidate = 120;

const HUB = LISTING_HUB_CONTENT.events;

const WHEN_CHIPS: FilterChip[] = [
  { label: "All upcoming", param: "when", value: null },
  { label: "This week", param: "when", value: "week" },
  { label: "This month", param: "when", value: "month" },
];

export const metadata = buildHubMetadata({
  path: HUB.path,
  title: HUB.metaTitle,
  description: HUB.metaDescription,
  keywords: HUB.keywords,
  ogKind: HUB.ogKind,
  ogTitle: HUB.ogTitle,
});

function filterByWhen(
  events: Awaited<ReturnType<typeof listUpcomingEventsForSite>>,
  when: string | null,
) {
  if (!when) return events;
  const now = new Date();
  const end = new Date(now);
  if (when === "week") {
    end.setDate(end.getDate() + 7);
  } else if (when === "month") {
    end.setMonth(end.getMonth() + 1);
  } else {
    return events;
  }
  return events.filter((e) => e.startsAt >= now && e.startsAt <= end);
}

export default async function LocalEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locality?: string; when?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || null;
  const locality = sp.locality?.trim() || null;
  const when =
    sp.when === "week" || sp.when === "month" ? sp.when : null;

  let upcoming: Awaited<ReturnType<typeof listUpcomingEventsForSite>> = [];
  try {
    if (q || locality) {
      const search = await searchAcross({ q, locality, type: "event", limit: 25 });
      const all = await listUpcomingEventsForSite(200);
      const ids = new Set(search.hits.event.map((h) => h.id));
      upcoming = all.filter((e) => ids.has(e.id));
    } else {
      upcoming = await listUpcomingEventsForSite(50);
    }
  } catch {
    /* DATABASE_URL unset or DB unreachable */
  }

  upcoming = filterByWhen(upcoming, when);

  const pageUrl = `${getSiteUrl()}${HUB.path}`;
  const filterParams = {
    q: q ?? undefined,
    locality: locality ?? undefined,
    when: when ?? undefined,
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
      <ListingHubSeoScripts
        hubPath={HUB.path}
        hubName={HUB.itemListName}
        description={HUB.metaDescription}
        breadcrumbLabel="Local events"
        items={upcoming.map((e) => ({
          name: e.title,
          href: `/local-events/${e.slug}`,
        }))}
      />

      <ListingHubShell
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Local events", href: HUB.path },
        ]}
        eyebrow={HUB.eyebrow}
        h1={HUB.h1}
        intro={HUB.intro}
        hubPath={HUB.path}
        eyebrowClassName="text-[var(--accent-warm)]"
      />

      <ListingGeoBlock
        question={HUB.geoQuestion}
        directAnswer={HUB.geoDirectAnswer}
        localityLine={HUB.localityLine}
      />

      <ListingHubSubmitCta
        title="Announce a local event"
        body="Temple utsavam, workshop, blood drive, RWA notice — share it with neighbours after a quick review."
        ctaHref={HUB.emptyCtaHref}
        ctaLabel={HUB.emptyCtaLabel}
      />

      <ListingFilterRow
        action={HUB.path}
        q={q ?? undefined}
        locality={locality ?? undefined}
        qPlaceholder="Search events…"
        chips={WHEN_CHIPS}
        currentParams={filterParams}
      />

      {upcoming.length === 0 ? (
        <ListingEmptyState
          title={HUB.emptyTitle}
          body={HUB.emptyBody}
          ctaHref={HUB.emptyCtaHref}
          ctaLabel={HUB.emptyCtaLabel}
        />
      ) : (
        <ul className="mt-8 space-y-3 sm:mt-10">
          {upcoming.map((e) => (
            <ListingCardEvent
              key={e.id}
              slug={e.slug}
              title={e.title}
              startsAt={e.startsAt}
              allDay={e.allDay}
              venueName={e.venueName}
              localityLabel={e.localityLabel}
            />
          ))}
        </ul>
      )}

      <ResponsiveAdSlot
        slotId="events-index-mid"
        pagePath={HUB.path}
        className="mt-10"
      />

      <FaqBlock items={HUB.faq} pageUrl={pageUrl} heading="Frequently asked questions" />

      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-events"
        className="mt-10 max-w-xl"
      />

      <Link
        href="/"
        className="mt-10 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
