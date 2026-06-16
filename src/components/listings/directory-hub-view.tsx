import Link from "next/link";
import { AmazonAffiliateBlock } from "@/components/affiliate/amazon-affiliate-block";
import { FaqBlock } from "@/components/faq/faq-block";
import { ListingCardDirectory } from "@/components/listings/listing-card-directory";
import { ListingEmptyState } from "@/components/listings/listing-empty-state";
import { ListingFilterRow } from "@/components/listings/listing-filter-row";
import { ListingGeoBlock } from "@/components/listings/listing-geo-block";
import { ListingHubShell } from "@/components/listings/listing-hub-shell";
import { ListingHubSeoScripts } from "@/components/listings/listing-hub-seo-scripts";
import { ListingHubSubmitCta } from "@/components/listings/listing-hub-submit-cta";
import { ListingHubTabs } from "@/components/listings/listing-hub-tabs";
import { ResponsiveAdSlot } from "@/components/listings/responsive-ad-slot";
import {
  listDirectoryEntriesForSite,
  type DirectoryTypeSlug,
} from "@/domains/directory";
import { directoryTypeTitle } from "@/lib/listings/format";
import { LISTING_HUB_CONTENT } from "@/lib/listings/hub-content";
import { canonicalUrl } from "@/lib/seo/canonical-url";

const HUB = LISTING_HUB_CONTENT.directory;

type SearchParams = { q?: string; locality?: string };

type Props = {
  typeFilter: DirectoryTypeSlug | null;
  searchParams: SearchParams;
};

export async function DirectoryHubView({ typeFilter, searchParams }: Props) {
  const q = searchParams.q?.trim().toLowerCase() || null;
  const locality = searchParams.locality?.trim().toLowerCase() || null;

  let entries: Awaited<ReturnType<typeof listDirectoryEntriesForSite>> = [];
  try {
    entries = await listDirectoryEntriesForSite();
  } catch {
    /* DATABASE_URL unset */
  }

  if (q) {
    entries = entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.localityLabel?.toLowerCase().includes(q) ?? false),
    );
  }
  if (locality) {
    entries = entries.filter((e) =>
      e.localityLabel?.toLowerCase().includes(locality),
    );
  }

  const byType = new Map<DirectoryTypeSlug, typeof entries>();
  for (const e of entries) {
    const t = e.type as DirectoryTypeSlug;
    const list = byType.get(t) ?? [];
    list.push(e);
    byType.set(t, list);
  }

  const allTypes = Array.from(byType.keys());
  const visibleTypes =
    typeFilter && byType.has(typeFilter)
      ? [typeFilter]
      : typeFilter
        ? []
        : allTypes;

  const hubPath = typeFilter ? `/directory/${typeFilter}` : HUB.path;
  const pageUrl = canonicalUrl(hubPath);
  const filterParams = {
    q: searchParams.q?.trim() || undefined,
    locality: searchParams.locality?.trim() || undefined,
  };

  const h1 = typeFilter
    ? `${directoryTypeTitle(typeFilter)} in Nanganallur`
    : HUB.h1;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
      <ListingHubSeoScripts
        hubPath={hubPath}
        hubName={
          typeFilter
            ? `${directoryTypeTitle(typeFilter)} · Nanganallur directory`
            : HUB.itemListName
        }
        description={HUB.metaDescription}
        breadcrumbLabel="Directory"
        items={entries.slice(0, 50).map((e) => ({
          name: e.name,
          href: `/directory/${e.type}/${e.slug}`,
        }))}
      />

      <ListingHubShell
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Directory", href: HUB.path },
          ...(typeFilter
            ? [
                {
                  name: directoryTypeTitle(typeFilter),
                  href: hubPath,
                },
              ]
            : []),
        ]}
        eyebrow={HUB.eyebrow}
        h1={h1}
        intro={HUB.intro}
        hubPath={hubPath}
      />

      <ListingGeoBlock
        question={HUB.geoQuestion}
        directAnswer={HUB.geoDirectAnswer}
        localityLine={HUB.localityLine}
      />

      <ListingHubSubmitCta
        title="List your business in the directory"
        body="Shops, schools, tutors, clinics, temples — free for residents. We review every submission within 24 hours."
        ctaHref={HUB.emptyCtaHref}
        ctaLabel={HUB.emptyCtaLabel}
        secondaryHref="/my/login"
        secondaryLabel="Manage my listings"
      />

      {allTypes.length > 0 ? (
        <ListingHubTabs
          types={allTypes}
          currentType={typeFilter}
          currentParams={filterParams}
        />
      ) : null}

      <ListingFilterRow
        action={hubPath}
        q={searchParams.q?.trim() || undefined}
        locality={searchParams.locality?.trim() || undefined}
        qPlaceholder="Search directory…"
        currentParams={filterParams}
      />

      {entries.length === 0 ? (
        <ListingEmptyState
          title={HUB.emptyTitle}
          body={HUB.emptyBody}
          ctaHref={HUB.emptyCtaHref}
          ctaLabel={HUB.emptyCtaLabel}
        />
      ) : (
        <div className="mt-10 space-y-12">
          {visibleTypes.map((type) => {
            const list = byType.get(type) ?? [];
            if (list.length === 0) return null;
            return (
              <section key={type} id={type} className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  {directoryTypeTitle(type)}
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((entry) => (
                    <ListingCardDirectory
                      key={entry.id}
                      type={type}
                      slug={entry.slug}
                      name={entry.name}
                      localityLabel={entry.localityLabel}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <ResponsiveAdSlot
        slotId="listings-index-top"
        pagePath={hubPath}
        className="mt-10"
      />

      <FaqBlock items={HUB.faq} pageUrl={pageUrl} heading="Frequently asked questions" />

      <AmazonAffiliateBlock
        variant="compact"
        placement="hub-directory"
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
