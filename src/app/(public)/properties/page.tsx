import Link from "next/link";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { ListingCardProperty } from "@/components/listings/listing-card-property";
import { ListingHubSubmitCta } from "@/components/listings/listing-hub-submit-cta";
import { ListingEmptyState } from "@/components/listings/listing-empty-state";
import { ListingFilterRow } from "@/components/listings/listing-filter-row";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { ListingHubShell } from "@/components/listings/listing-hub-shell";
import { ListingHubSeoScripts } from "@/components/listings/listing-hub-seo-scripts";
import { ListingKindTabs } from "@/components/listings/listing-kind-tabs";
import { ResponsiveAdSlot } from "@/components/listings/responsive-ad-slot";
import { PropertyListWhatsAppCta } from "@/components/properties/property-list-whatsapp-cta";
import { listPublishedPropertiesForSite } from "@/domains/properties";
import { searchAcross } from "@/domains/search";
import { LISTING_HUB_CONTENT } from "@/lib/listings/hub-content";
import { buildHubMetadata } from "@/lib/seo/hub-page-metadata";
import { getSiteUrl } from "@/lib/env";

export const revalidate = 120;

const HUB = LISTING_HUB_CONTENT.properties;

export const metadata = buildHubMetadata({
  path: HUB.path,
  title: HUB.metaTitle,
  description: HUB.metaDescription,
  keywords: HUB.keywords,
  ogKind: HUB.ogKind,
  ogTitle: HUB.ogTitle,
});

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locality?: string; kind?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || null;
  const locality = sp.locality?.trim() || null;
  const kind =
    sp.kind === "rent" || sp.kind === "sale" ? sp.kind : null;

  let rows: Awaited<ReturnType<typeof listPublishedPropertiesForSite>> = [];
  try {
    if (q || locality) {
      const search = await searchAcross({
        q,
        locality,
        type: "property",
        limit: 25,
      });
      const all = await listPublishedPropertiesForSite(200);
      const ids = new Set(search.hits.property.map((h) => h.id));
      rows = all.filter((p) => ids.has(p.id));
    } else {
      rows = await listPublishedPropertiesForSite(80);
    }
  } catch {
    /* DATABASE_URL unset */
  }

  if (kind) {
    rows = rows.filter((p) => p.kind === kind);
  }

  const pageUrl = `${getSiteUrl()}${HUB.path}`;
  const filterParams = { q: q ?? undefined, locality: locality ?? undefined, kind: kind ?? undefined };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
      <ListingHubSeoScripts
        hubPath={HUB.path}
        hubName={HUB.itemListName}
        description={HUB.metaDescription}
        breadcrumbLabel="Properties"
        items={rows.map((p) => ({
          name: p.title,
          href: `/properties/${p.slug}`,
        }))}
      />

      <ListingHubShell
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Properties", href: HUB.path },
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
        title="Post a property listing"
        body="Rent or sale — reach genuine local renters and buyers. We publish after a quick review."
        ctaHref={HUB.emptyCtaHref}
        ctaLabel={HUB.emptyCtaLabel}
      />

      <ListingKindTabs currentParams={filterParams} />

      <ListingFilterRow
        action={HUB.path}
        q={q ?? undefined}
        locality={locality ?? undefined}
        qPlaceholder="Search properties…"
        currentParams={filterParams}
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
          {rows.map((p) => (
            <ListingCardProperty
              key={p.id}
              slug={p.slug}
              title={p.title}
              kind={p.kind}
              localityLabel={p.localityLabel}
              bedrooms={p.bedrooms}
              areaSqft={p.areaSqft}
              rentPerMonth={p.rentPerMonth}
              salePrice={p.salePrice}
              featured={p.featured}
            />
          ))}
        </ul>
      )}

      <PropertyListWhatsAppCta className="mt-10 max-w-xl" />

      <ResponsiveAdSlot
        slotId="properties-index-mid"
        pagePath={HUB.path}
        className="mt-10"
      />

      <FaqBlock items={HUB.faq} pageUrl={pageUrl} heading="Frequently asked questions" />

      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-properties"
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
